const util = require('./util');

const main = async () => {
    const requestBody = {
        memo: 'Memo',
        value_msat: 0,
        expiry: 1*60
    };
    const options = util.getLndRestOptions('/v1/invoices', requestBody);
    const response = await util.postRequest(options);
    const invoice = response.body;
    util.logQrCode(invoice.payment_request);
    util.logInvoice(invoice);
}

main();
