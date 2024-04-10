import {homedir} from 'os';
import {readFileSync} from 'fs';
import request from 'request';
import qrcode from 'qrcode';

const JSON_RPC_HOST = 'localhost:8332';
const JSON_RPC_URI = `http://${JSON_RPC_HOST}`;
const JSON_RPC = '1.0';
const JSON_RPC_ID = 'js-test';
const USERNAME = 'bitagent';
export const QUESTION_PASSWORD = `Enter host password for user '${USERNAME}': `;

const LND_REST_HOST = 'localhost:10080';
const LND_REST_URL = `https://${LND_REST_HOST}`;
const LND_MACAROON_PATH = homedir + '/.lnd/data/chain/bitcoin/mainnet/admin.macaroon'

function getJsonRpcHeaders(username, password) {
    return {
        'content-type': 'text/plain;',
        'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    }
}
export function getJsonRpcOptions(method, params, password) {
    const options = {
        uri: JSON_RPC_URI,
        json: {
            jsonrpc: JSON_RPC,
            id: JSON_RPC_ID,
            method: method,
            params: params
        },
        headers: getJsonRpcHeaders(USERNAME, password)
    }
    return options;
}
export function getLndRestOptions(context, requestBody) {
    const options = {
        url: `${LND_REST_URL}${context}`,
        // Work-around for self-signed certificates.
        rejectUnauthorized: false,
        json: true,
        headers: {
            'Grpc-Metadata-macaroon': readFileSync(LND_MACAROON_PATH).toString('hex')
        },
        form: JSON.stringify(requestBody)
    }
    return options;
}
export function getUriOptions(uri, body) {
    if (body) {
        return {
            uri: uri,
            body: body,
            json: true
        }
    } else {
        return {
            uri: uri
        }
    }
}

export function getRequest(options) {
    const promise = new Promise(resolve => {
        request.get(options, function(error, response, body) {
            logResponse(error, response, body);
            if (response) {
                resolve(response);
            } else {
                resolve(error);
            }
        });
    });
    return promise;
}
export function postRequest(options) {
    const promise = new Promise(resolve => {
        request.post(options, function(error, response, body) {
            logResponse(error, response, body);
            if (response) {
                resolve(response);
            } else {
                resolve(error);
            }
        });
    });
    return promise;
}
function logResponse(error, response, body) {
    if (response) {
        console.log(response.statusCode, response.body);
    } else {
        console.error(error);
    }
}
export function logQrCode(data) {
    qrcode.toString(data, {type:'terminal', small: true}, function (err, url) {
        console.log(url);
    });
}
export function getQrCode(data) {
    const promise = new Promise(resolve => {
        qrcode.toDataURL(data, function (err, url) {
            if (err) {
                throw new Error(err);
            } else {
                resolve(url);
            }
        });
    });
    return promise;
}
export function logInvoice(invoice) {
    let expiry_date = '';
    if (invoice.creation_date) {
        expiry_date = new Date((Number(invoice.creation_date) + Number(invoice.expiry)) * 1000);
    }
    const hash = Buffer.from(invoice.r_hash, 'base64').toString('hex');
    console.log(invoice.add_index, invoice.state ? invoice.state : '', invoice.value_msat ? invoice.value_msat : '', expiry_date, hash);
}

export function validateLightningAddress(lightningAddress) {
    const indexAt = lightningAddress?.indexOf('@');
    if (indexAt > 0) {
        return true;
    } else {
        return false;
    }
}
export const LIGHTNING_ADDRESS_INVALID = 'Lightning Address invalid!';
export function getLightningAddressUri(lightningAddress) {
    const lightningAddressArray = lightningAddress.split('@');
    const uri = `https://${lightningAddressArray[1]}/.well-known/lnurlp/${lightningAddressArray[0]}`;
    return uri;
}
