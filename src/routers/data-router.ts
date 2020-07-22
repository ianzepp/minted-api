import * as _ from 'lodash';

// API
import { Filter } from '../classes/filter';
import { Schema } from '../classes/schema';
import { Router } from '../classes/router';

// Implementation
export class DataRouter extends Router {
    // Hooks
    toRouterPath() {
        return '/api/data/:schema/:id?';
    }
}
