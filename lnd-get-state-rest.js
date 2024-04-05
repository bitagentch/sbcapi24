const util = require('./util');

const options = util.getLndRestOptions('/v1/state');
util.getRequest(options);
