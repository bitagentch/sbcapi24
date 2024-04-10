import { getLndRestOptions, getRequest, logInvoice } from './util.js';

const main = async () => {
    const options = getLndRestOptions('/v1/invoices');
    const response = await getRequest(options);
    response.body.invoices.forEach(invoice => {
        logInvoice(invoice);
    });
}

main();
