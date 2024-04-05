const util = require('./util');
const readlineSync = require('readline-sync');

const main = async () => {
    const lightningAddress = process.argv[2];
    if (!util.validateLightningAddress(lightningAddress)) {
        console.error(util.LIGHTNING_ADDRESS_INVALID);
        process.exit();
    }
    let options = util.getUriOptions(util.getLightningAddressUri(lightningAddress));
    let response = await util.getRequest(options);
    let body = JSON.parse(response.body);
    if ('payRequest' == body.tag) {
        console.log('Min', body.minSendable);
        console.log('Max', body.maxSendable);

        const amount = readlineSync.question('Amount [msat] ');
        if (amount >= body.minSendable && amount <= body.maxSendable) {
            console.log('Max Comment', body.commentAllowed);

            const comment = readlineSync.question('Comment ');
            if (comment.length >= 0 && comment.length <= body.commentAllowed) {
                options = util.getUriOptions(body.callback + '?amount=' + amount + '&comment=' + comment);
                response = await util.getRequest(options);
                if (200 === response.statusCode) {
                    body = JSON.parse(response.body);
                    if ('ERROR' === body.status) {
                        console.error(body);
                    } else {
                        util.logQrCode(body.pr);
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
