import _ from 'lodash';
import Chai from 'chai';

export class ExpectApi {
    static isRecord(something: unknown) {
        Chai.expect(something).not.undefined;
        Chai.expect(something).not.null;
        Chai.expect(something).a('object');

        if (_.isPlainObject(something) === false) {
            something = JSON.parse(JSON.stringify(something));
        }

        Chai.expect(something).property('type').a('string');
        Chai.expect(something).property('data').a('object').not.empty;
        Chai.expect(something).property('meta').a('object').not.empty;
        Chai.expect(something).property('acls').a('object').not.empty;

        Chai.expect(something).nested.property('meta.created_at').a('string');
        Chai.expect(something).nested.property('meta.created_by').a('string');
        Chai.expect(something).nested.property('meta.updated_at').a('string');
        Chai.expect(something).nested.property('meta.updated_by').a('string');

        Chai.expect(something).nested.property('acls.full').a('array');
        Chai.expect(something).nested.property('acls.edit').a('array');
        Chai.expect(something).nested.property('acls.read').a('array');
        Chai.expect(something).nested.property('acls.deny').a('array');

        return true;
    }
}
