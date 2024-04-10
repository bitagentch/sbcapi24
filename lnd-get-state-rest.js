import { getLndRestOptionsGot, getGot } from './util.js';

const options = getLndRestOptionsGot('/v1/state');
getGot(options);
