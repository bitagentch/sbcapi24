import {QUESTION_PASSWORD, getJsonRpcOptions, postRequest} from './util.js';
import {question} from 'readline-sync';

const main = async () => {
    const block = process.argv[2];
    if (isNaN(block)) {
        console.error('Block missing!');
        process.exit();
    }
    const password = question(QUESTION_PASSWORD, {hideEchoBack: true});

    let options = getJsonRpcOptions('getblockhash', [Number(block)], password);
    let response = await postRequest(options);
    if (200 === response.statusCode) {
        const blockhash = response.body.result;

        options = getJsonRpcOptions('getblock', [blockhash], password);
        response = await postRequest(options);
        if (200 === response.statusCode) {
            const blockdata = response.body.result;
            console.log('Block', blockdata.height, '@', new Date(blockdata.time * 1000));
        }
    }
}

main();
