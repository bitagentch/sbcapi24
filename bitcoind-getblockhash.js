import {QUESTION_PASSWORD, getJsonRpcOptions, postRequest} from './util.js';
import {question} from 'readline-sync';

const block = process.argv[2];
if (isNaN(block)) {
    console.error('Block missing!');
    process.exit();
}
const password = question(QUESTION_PASSWORD, {hideEchoBack: true});
const options = getJsonRpcOptions('getblockhash', [Number(block)], password);
postRequest(options);
