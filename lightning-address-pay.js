import { validateLightningAddress, LIGHTNING_ADDRESS_INVALID, getUriOptions, getLightningAddressUri, getRequest, logQrCode } from './util.js';
import { question } from 'readline-sync';

const main = async () => {
    const lightningAddress = process.argv[2];
    if (!validateLightningAddress(lightningAddress)) {
        console.error(LIGHTNING_ADDRESS_INVALID);
        process.exit();
    }
    let options = getUriOptions(getLightningAddressUri(lightningAddress));
    let response = await getRequest(options);
    let body = JSON.parse(response.body);
    if ('payRequest' == body.tag) {
        console.log('Min', body.minSendable);
        console.log('Max', body.maxSendable);

        const amount = question('Amount [msat] ');
        if (amount >= body.minSendable && amount <= body.maxSendable) {
            console.log('Max Comment', body.commentAllowed);

            const comment = question('Comment ');
            if (comment.length >= 0 && comment.length <= body.commentAllowed) {
                options = getUriOptions(body.callback + '?amount=' + amount + '&comment=' + comment);
                response = await getRequest(options);
                if (200 === response.statusCode) {
                    body = JSON.parse(response.body);
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
