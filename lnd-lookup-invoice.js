import { getLndRestOptionsGot, getGot, logQrCode, logInvoice } from './util.js';

const main = async function () {
    const hexString = process.argv[2];
    if (64 !== hexString?.length) {
        console.error('Hash invalid!');
        process.exit();
    }

    const options = getLndRestOptionsGot('/v1/invoice/' + hexString);
    const response = await getGot(options);
    if (200 === response.statusCode) {
        const invoice = response.body;
        logQrCode(invoice.payment_request);
        logInvoice(invoice);
    }
}

main();
