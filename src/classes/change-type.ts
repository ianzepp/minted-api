import _ from 'lodash';

import { Record } from '../classes/record';
import { RecordJson } from '../classes/record';

export type ChangeType = Record | RecordJson | _.Dictionary<any>;
