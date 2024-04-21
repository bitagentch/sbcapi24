import { validateLightningAddress, LIGHTNING_ADDRESS_INVALID, getRestOptionsGot, getLightningAddressUri, getGot, logQrCode } from './util.js';
import { question } from 'readline-sync';

const main = async function () {
    const lightningAddress = process.argv[2];
    if (!validateLightningAddress(lightningAddress)) {
        console.error(LIGHTNING_ADDRESS_INVALID);
        process.exit();
    }
    let options = getRestOptionsGot(getLightningAddressUri(lightningAddress));
    let response = await getGot(options);
    let body = response.body;
    if ('payRequest' == body.tag) {
        console.log('Min', body.minSendable);
        console.log('Max', body.maxSendable);

        const amount = question('Amount [msat] ');
        if (amount >= body.minSendable && amount <= body.maxSendable) {
            console.log('Max Comment', body.commentAllowed);

            const comment = question('Comment ');
            if (comment.length >= 0 && comment.length <= body.commentAllowed) {
                options = getRestOptionsGot(body.callback + '?amount=' + amount + '&comment=' + comment);
                response = await getGot(options);
                if (200 === response.statusCode) {
                    body = response.body;
                    if ('ERROR' === body.status) {
                        console.error(body);
                    } else {
                        logQrCode(body.pr);
                    }
                } else {
                    console.error('Error', response);
                }
            } else {
                console.error('Comment invalid!');
            }
        } else {
            console.error('Amount invalid!');
        }
    } else {
        console.error('Pay not possible!');
    }
    process.exit();
}

main();
