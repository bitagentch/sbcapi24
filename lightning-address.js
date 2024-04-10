import { validateLightningAddress, LIGHTNING_ADDRESS_INVALID, getUrlOptionsGot, getLightningAddressUri, getGot } from './util.js';

const main = async function () {
    const lightningAddress = process.argv[2];
    if (!validateLightningAddress(lightningAddress)) {
        console.error(LIGHTNING_ADDRESS_INVALID);
        process.exit();
    }
    const options = getUrlOptionsGot(getLightningAddressUri(lightningAddress));
    getGot(options);
}

main();
