import { getLndRestOptions, postRequest, logQrCode, logInvoice } from './util.js';

const main = async () => {
    const requestBody = {
        memo: 'Memo',
        value_msat: 0,
        expiry: 1*60
    };
    const options = getLndRestOptions('/v1/invoices', requestBody);
    const response = await postRequest(options);
    const invoice = response.body;
    logQrCode(invoice.payment_request);
    logInvoice(invoice);
}

main();
