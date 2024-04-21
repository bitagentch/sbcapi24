import { validateLightningAddress, LIGHTNING_ADDRESS_INVALID, getRestOptionsGot, getLightningAddressUri, getGot } from './util.js';

const lightningAddress = process.argv[2];
if (!validateLightningAddress(lightningAddress)) {
    console.error(LIGHTNING_ADDRESS_INVALID);
    process.exit();
}
const options = getRestOptionsGot(getLightningAddressUri(lightningAddress));
getGot(options);
