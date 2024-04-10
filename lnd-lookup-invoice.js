import { getLndRestOptions, getRequest, logQrCode, logInvoice } from './util.js';

const main = async () => {
    const hexString = process.argv[2];
    if (64 !== hexString?.length) {
        console.error('Hash invalid!');
        process.exit();
    }

    const options = getLndRestOptions('/v1/invoice/' + hexString);
    const response = await getRequest(options);
    const invoice = response.body;
    logQrCode(invoice.payment_request);
    logInvoice(invoice);
}

main();
