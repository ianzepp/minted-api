import _ from 'lodash';
import Knex from 'knex';

// API
import { FilterWhereClause } from '../typedefs/filter';
import { FilterOrderClause } from '../typedefs/filter';
import { FilterInfo } from '../typedefs/filter';

// Classes
import { System } from '../classes/system';

export class KnexFilter {
    constructor(readonly system: System, readonly knex: Knex.QueryBuilder, readonly filter: FilterInfo) {}

    toStatement() {
        let knex = this.knex;

        // Add platform visibility restrictions
        knex.where(wrap => wrap.whereIn('ns', ['system']));
        knex.where(wrap => wrap.whereIn('sc', ['public']).orWhereNull('sc'));

        // Add ACLs / sharing restrictions
        this._share(knex);

        // Where
        this.filter.where.forEach(clause => this._where(knex, clause));

        // Order
        this.filter.order.forEach(clause => this._order(knex, clause));

        // Limit
        knex.limit(this.filter.limit || 10000);

        // Done
        return knex;
    }

    private _share(knex: Knex.QueryBuilder) {
        let access_list = this.system.user.access_list;

        // This is hacky but it works WAY better on PG than inverting the comparison
        // and listing out the individual OR clauses for each ACL column.
        knex.where(wrap => {
            // Sharing allowed
            wrap.whereRaw('(?? || ?? || ?? || ??) && ?', [
                'meta__created_by',
                'acls__full',
                'acls__edit',
                'acls__read',
                access_list
            ]);

            // Sharing denied
            wrap.whereRaw('not (?? && ?)', ['acls__deny', access_list]);
        });

        // Left here for posterity..

        // knex.where(wrap => {
        //     wrap.orWhere(q => this._where_one(q, 'acls__owns', '$any', access_list));
        //     wrap.orWhere(q => this._where_one(q, 'acls__full', '$any', access_list));
        //     wrap.orWhere(q => this._where_one(q, 'acls__edit', '$any', access_list));
        //     wrap.orWhere(q => this._where_one(q, 'acls__read', '$any', access_list));
        // });
        //
        // knex.where(wrap => {
        //     wrap.orWhereNot(q => this._where_one(q, 'acls__deny', '$any', access_list));
        // });
    }

    private _where(knex: Knex.QueryBuilder, clause: FilterWhereClause) {
        _.forIn(clause, (data, column_name) => {
            // Convert property shorthand. Ignored for groupings.
            column_name = this._to_column_name(column_name);

            // Is this a grouping?
            if (['$and', '$or', '$not', '$nor'].includes(column_name) && data instanceof Array) {
                return this._where_grouping(knex, column_name, data);
            }

            // Is the data a native type?
            if (typeof data === 'string') {
                return this._where_one(knex, column_name, '$eq', data);
            }

            if (typeof data === 'number') {
                return this._where_one(knex, column_name, '$eq', data);
            }

            if (typeof data === 'boolean') {
                return this._where_one(knex, column_name, '$eq', data);
            }

            // Is this a
            _.forIn(data, (condition, op) => this._where_one(knex, column_name, op, condition));
        });
    }

    private _where_grouping(knex: Knex.QueryBuilder, op: string, conditions: FilterWhereClause[]) {
        knex.where(knex_inner => {
            _.forEach(conditions, clause => {
                if (op === '$and') {
                    knex_inner.where(q => this._where(q, clause));
                }

                if (op === '$not') {
                    knex_inner.whereNot(q => this._where(q, clause));
                }

                if (op === '$or') {
                    knex_inner.orWhere(q => this._where(q, clause));
                }

                if (op === '$nor') {
                    knex_inner.orWhereNot(q => this._where(q, clause));
                }
            });
        });
    }

    private _where_one(knex: Knex.QueryBuilder, column_name: string, op: string, data: any) {
        if (data === undefined) {
            return knex;
        }

        if (op === '$eq' && data === null) {
            return knex.whereNull(column_name);
        }

        if (op === '$eq') {
            return knex.where(column_name, '=', data);
        }

        if (op === '$ne' && data === null) {
            return knex.whereNotNull(column_name);
        }

        if (op === '$ne') {
            return knex.where(column_name, '<>', data);
        }

        if (op === '$in' && data instanceof Array) {
            return knex.whereIn(column_name, data);
        }

        if (op === '$nin' && data instanceof Array) {
            return knex.whereNotIn(column_name, data);
        }

        if (op === '$gt') {
            return knex.where(column_name, '>', data);
        }

        if (op === '$gte') {
            return knex.where(column_name, '>=', data);
        }

        if (op === '$lt') {
            return knex.where(column_name, '<', data);
        }

        if (op === '$lte') {
            return knex.where(column_name, '<=', data);
        }

        if (op === '$like' && typeof data === 'string' && data.includes('%')) {
            return knex.where(column_name, 'LIKE', data);
        }

        if (op === '$like' && typeof data === 'string') {
            return knex.where(column_name, 'LIKE', '%' + data + '%');
        }

        // Less common stuff
        if (op === '$all' && data instanceof Array) {
            return knex.whereRaw('?? @> ?', [column_name, data]);
        }

        if (op === '$any' && data instanceof Array) {
            return knex.whereRaw('?? && ?', [column_name, data]);
        }

        // No other matches
        return knex;
    }

    private _order(knex: Knex.QueryBuilder, clause: FilterOrderClause) {
        _.forIn(clause, (data, column_name) => {
            knex.orderBy(this._to_column_name(column_name), data);
        });
    }

    private _to_column_name(column_name: string) {
        if (column_name.startsWith('$')) {
            return column_name;
        }

        // Convert meta property shorthands
        if (['created_at', 'created_by'].includes(column_name)) {
            return 'meta__' + column_name;
        }

        if (['updated_at', 'updated_by'].includes(column_name)) {
            return 'meta__' + column_name;
        }

        if (['trashed_at', 'trashed_by'].includes(column_name)) {
            return 'meta__' + column_name;
        }

        if (['deleted_at', 'deleted_by'].includes(column_name)) {
            return 'meta__' + column_name;
        }

        return column_name;
    }
}
