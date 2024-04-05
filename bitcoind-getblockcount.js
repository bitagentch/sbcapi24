const util = require("./util.js");
const readlineSync = require('readline-sync');

const password = readlineSync.question(util.QUESTION_PASSWORD, {hideEchoBack: true});
const options = util.getJsonRpcOptions('getblockcount', [], password);
util.postRequest(options);
