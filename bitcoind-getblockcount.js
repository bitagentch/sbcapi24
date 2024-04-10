import {QUESTION_PASSWORD, getJsonRpcOptionsGot, postGot} from './util.js';
import {question} from 'readline-sync';

const password = question(QUESTION_PASSWORD, {hideEchoBack: true});
const options = getJsonRpcOptionsGot('getblockcount', [], password);
postGot(options);
