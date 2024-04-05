const util = require("./util.js");
const readlineSync = require('readline-sync');

const main = async () => {
    const block = process.argv[2];
    if (isNaN(block)) {
        console.error('Block missing!');
        process.exit();
    }
    const password = readlineSync.question(util.QUESTION_PASSWORD, {hideEchoBack: true});

    let options = util.getJsonRpcOptions('getblockhash', [Number(block)], password);
    let response = await util.postRequest(options);
    if (200 === response.statusCode) {
        const blockhash = response.body.result;

        options = util.getJsonRpcOptions('getblock', [blockhash], password);
        response = await util.postRequest(options);
        if (200 === response.statusCode) {
            const blockdata = response.body.result;
            console.log('Block', blockdata.height, '@', new Date(blockdata.time * 1000));
        }
    }
}

main();
