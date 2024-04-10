import {QUESTION_PASSWORD, getJsonRpcOptions, postRequest} from './util.js';
import {question} from 'readline-sync';

const password = question(QUESTION_PASSWORD, {hideEchoBack: true});
const options = getJsonRpcOptions('getblockcount', [], password);
postRequest(options);
