import {QUESTION_PASSWORD, getJsonRpcOptionsGot, postGot} from './util.js';
import {question} from 'readline-sync';

const tx = process.argv[2];
if (64 !== tx.length) {
    console.error('Tx missing!');
    process.exit();
}
const password = question(QUESTION_PASSWORD, {hideEchoBack: true});
const options = getJsonRpcOptionsGot('getrawtransaction', [tx], password);
postGot(options);
