const util = require("./util.js");
const readlineSync = require('readline-sync');

const block = process.argv[2];
if (isNaN(block)) {
    console.error('Block missing!');
    process.exit();
}
const password = readlineSync.question(util.QUESTION_PASSWORD, {hideEchoBack: true});
const options = util.getJsonRpcOptions('getblockhash', [Number(block)], password);
util.postRequest(options);
