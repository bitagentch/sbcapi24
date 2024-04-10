import { getLndRestOptionsGot, postGot, logQrCode, logInvoice } from './util.js';

const main = async function () {
    const requestBody = {
        memo: 'Memo',
        value_msat: 0,
        expiry: 1*60
    };
    const options = getLndRestOptionsGot('/v1/invoices', requestBody);
    const response = await postGot(options);
    if (200 === response.statusCode) {
        const invoice = response.body;
        logQrCode(invoice.payment_request);
        logInvoice(invoice);
    }
}

main();
