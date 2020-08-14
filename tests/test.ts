import _ from 'lodash';
import Chai from 'chai';

export class Test {
    static expect(something: unknown, message?: string) {
        Chai.expect(something).not.undefined;
        Chai.expect(something).not.null;

        if (_.isArray(something)) {
            something = Test.toJSON(something);
        }

        if (_.isPlainObject(something) === false) {
            something = Test.toJSON(something);
        }

        return Chai.expect(something, message);
    }

    static toJSON(something: unknown) {
        return JSON.parse(JSON.stringify(something));
    }

    static isRecord(something: unknown) {
        Chai.expect(something).not.undefined;
        Chai.expect(something).not.null;
        Chai.expect(something).a('object');

        if (_.isPlainObject(something) === false) {
            something = Test.toJSON(something);
        }

        Chai.expect(something).property('type').a('string');
        Chai.expect(something).property('data').a('object').not.empty;
        Chai.expect(something).property('meta').a('object').not.empty;
        Chai.expect(something).property('acls').a('object').not.empty;

        Chai.expect(something).nested.property('data.id').a('string');
        Chai.expect(something).nested.property('data.ns').a('string');

        Chai.expect(something).nested.property('meta.created_at').a('string');
        Chai.expect(something).nested.property('meta.created_by').a('string');
        Chai.expect(something).nested.property('meta.updated_at').a('string');
        Chai.expect(something).nested.property('meta.updated_by').a('string');

        Chai.expect(something).nested.property('acls.full').a('array');
        Chai.expect(something).nested.property('acls.edit').a('array');
        Chai.expect(something).nested.property('acls.read').a('array');
        Chai.expect(something).nested.property('acls.deny').a('array');

        return Chai.expect(something);
    }

    static isRecordList(something: unknown) {
        Chai.expect(something).not.undefined;
        Chai.expect(something).not.null;
        Chai.expect(something).a('array');

        (<unknown[]>something).forEach(record => Test.isRecord(record));

        return Chai.expect(something);
    }
}
