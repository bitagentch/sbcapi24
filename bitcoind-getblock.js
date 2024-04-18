import {QUESTION_PASSWORD, postGot, getJsonRpcOptionsGot} from './util.js';
import {question} from 'readline-sync';

const main = async function () {
    const block = process.argv[2];
    if (isNaN(block)) {
        console.error('Block missing!');
        process.exit();
    }
    const password = question(QUESTION_PASSWORD, {hideEchoBack: true});

    let options = getJsonRpcOptionsGot('getblockhash', [Number(block)], password);
    let response = await postGot(options);
    if (200 === response.statusCode) {
        const blockhash = response.body.result;

        options = getJsonRpcOptionsGot('getblock', [blockhash], password);
        response = await postGot(options);
        if (200 === response.statusCode) {
            const blockdata = response.body.result;
            const txArray = response.body.result.tx;
            console.log('Tx', txArray.length, 'Tx0', txArray[0]);
            console.log('Block', blockdata.height, '@', new Date(blockdata.time * 1000));
        }
    }
}

main();
