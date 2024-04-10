import { getLndRestOptionsGot, getGot, logInvoice } from './util.js';

const main = async function () {
    const options = getLndRestOptionsGot('/v1/invoices');
    const response = await getGot(options);
    if (200 === response.statusCode) {
        response.body.invoices.forEach(invoice => {
            logInvoice(invoice);
        });
    }
}

main();
