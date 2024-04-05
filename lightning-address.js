const util = require('./util');

const main = async () => {
    const lightningAddress = process.argv[2];
    if (!util.validateLightningAddress(lightningAddress)) {
        console.error(util.LIGHTNING_ADDRESS_INVALID);
        process.exit();
    }
    const options = util.getUriOptions(util.getLightningAddressUri(lightningAddress));
    const response = await util.getRequest(options);
    const body = JSON.parse(response.body);
    console.log(body);
}

main();
