import {QUESTION_PASSWORD, getJsonRpcOptionsGot, postGot} from './util.js';
import {question} from 'readline-sync';

const block = process.argv[2];
if (isNaN(block)) {
    console.error('Block missing!');
    process.exit();
}
const password = question(QUESTION_PASSWORD, {hideEchoBack: true});
const options = getJsonRpcOptionsGot('getblockhash', [Number(block)], password);
postGot(options);
