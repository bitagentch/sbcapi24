const util = require('./util');

const main = async () => {
    const hexString = process.argv[2];
    if (64 !== hexString?.length) {
        console.error('Hash invalid!');
        process.exit();
    }

    const options = util.getLndRestOptions('/v1/invoice/' + hexString);
    const response = await util.getRequest(options);
    const invoice = response.body;
    util.logQrCode(invoice.payment_request);
    util.logInvoice(invoice);
}

main();
