import * as _ from 'lodash';

import { Flow } from '../classes/flow';

export const FlowLocals: _.Dictionary<typeof Flow[]> = {
    'system__record': [
        require('../flows/system__record/database-select')
    ]
}
