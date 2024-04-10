import { validateLightningAddress, LIGHTNING_ADDRESS_INVALID, getUriOptions, getLightningAddressUri, getRequest } from './util.js';

const main = async () => {
    const lightningAddress = process.argv[2];
    if (!validateLightningAddress(lightningAddress)) {
        console.error(LIGHTNING_ADDRESS_INVALID);
        process.exit();
    }
    const options = getUriOptions(getLightningAddressUri(lightningAddress));
    const response = await getRequest(options);
    const body = JSON.parse(response.body);
    console.log(body);
}

main();
