import { getLndRestOptions, getRequest } from './util.js';

const options = getLndRestOptions('/v1/state');
getRequest(options);
