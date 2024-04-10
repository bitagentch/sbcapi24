import { homedir } from 'os';
import { readFileSync } from 'fs';
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

const GRPC_HOST = 'localhost:10009';
const TLS_PATH = homedir + '/.lnd/tls.cert';

const loaderOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
const packageDefinition = loadSync(['stateservice.proto'], loaderOptions);
const lnrpc = loadPackageDefinition(packageDefinition).lnrpc;
process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA';
const tlsCert = readFileSync(TLS_PATH);
const sslCreds = credentials.createSsl(tlsCert);
let client = new lnrpc.State(GRPC_HOST, sslCreds);

let request = {};
client.getState(request, function(err, response) {
  console.log(response);
});
