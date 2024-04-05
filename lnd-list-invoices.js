const util = require('./util');

const main = async () => {
    const options = util.getLndRestOptions('/v1/invoices');
    const response = await util.getRequest(options);
    response.body.invoices.forEach(invoice => {
        util.logInvoice(invoice);
    });
}

main();
