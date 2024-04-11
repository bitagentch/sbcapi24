---
marp: true
---

<!-- Global style -->
<style>
    html, section, div {
        background: orange;
    }
    section, span, li {
        color: black;
        clear: both;
    }
    pre {
        color: black;
        background: white;
        clear: both;
    }
    hr {
        background: #3468C0;
        clear: both;
    }
    h1, h2 {
        color: black;
        font-family: monospace;
    }
    a, a:hover {
        color: #3468C0;
        font-family: monospace;
        text-decoration: none;
    }
    img {
        float: right;
        margin: 0.25rem;
    }
</style>

[Swiss Bitcoin Conference](https://swiss-bitcoin-conference.com/) | 27. April 2024
## Nerd Academy
# BTC & LN Schnittstellen (API)
[beat@bitagent.ch](mailto:beat@bitagent.ch) | [bitagent.ch](https://bitagent.ch) | [github.com/bitagentch/sbcapi24](https://github.com/bitagentch/sbcapi24)

---
# [bitagent.ch](https://bitagent.ch)
- Bitcoin kaufen, sparen und verkaufen
- Technische Beratung zu Kauf, Eigenverwahrung und Verkauf
- Kaufen u.a. via [Pocket REST API](https://pocketbitcoin.com/developers/docs/rest/v1) und 10% Gebühren sparen
- Weitere Dienste: Lightning Adresse, Nostr Identifier

---
# APIs und Protokolle im Bitcoin Umfeld
1. Bitcoin RPC API (JSON-RPC)
1. Lightning Network Daemon LND API (gRPC, REST)
1. LNURL Documents LUDs
1. Nostr Implementation Possibilities NIPs
1. LnPay Api und App https://lnpay.onrender.com

---
# 1 Bitcoin RPC API (JSON-RPC)
- [RPC API Reference](https://developer.bitcoin.org/reference/rpc/)
```
bitcoind
bitcoin-cli
```
- Port 8332
- `vi ~/.bitcoin/bitcoin.conf` (restart bitcoind)
```
rpcuser=myusername
rpcpassword=mypassword
```

---
# 1.1 [getblockcount](https://developer.bitcoin.org/reference/rpc/getblockcount.html)
```
bitcoin-cli getblockcount
834404
```
```
curl --user bitagent \
--data-binary '{"jsonrpc": "1.0", "id": "curltest", "method": "getblockcount", "params": []}' \
-H 'content-type: text/plain;' \
http://127.0.0.1:8332/

{"result":834404,"error":null,"id":"curltest"}
```
```
node bitcoind-getblockcount.js
200 { result: 834404, error: null, id: 'js-test' }
```

---
# 1.2 [getblockhash](https://developer.bitcoin.org/reference/rpc/getblockhash.html)
```
bitcoin-cli getblockhash 0
000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f
```
```
node bitcoind-getblockhash.js 0
200 {
  result: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
  error: null,
  id: 'js-test'
}
```

---
# 1.3 [getblock](https://developer.bitcoin.org/reference/rpc/getblock.html)
```
bitcoin-cli getblock 000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f
height: 0, time: 1231006505
```
```
node bitcoind-getblock.js 0
Block 0 @ 2009-01-03T18:15:05.000Z
```

---
# 2 LND API (gRPC, REST)
- [LND API](https://lightning.engineering/api-docs/api/lnd/)
```
lnd
lncli
```
- Port 10009 gRpc
- Port 10080 Rest (default 8080)
- `vi ~/.lnd/lnd.conf`
```
bitcoind.rpcuser=myusername
bitcoind.rpcpass=mypassword
```

---
## 2.1 [GetState](https://lightning.engineering/api-docs/api/lnd/state/get-state)
```
lncli state
{ "state": "SERVER_ACTIVE" }
```
```
node lnd-get-state-rest.js
200 { state: 'SERVER_ACTIVE' }
```
```
node lnd-get-state-grpc.js
{ state: 'SERVER_ACTIVE' }
```

---
## 2.2 [AddInvoice](https://lightning.engineering/api-docs/api/lnd/lightning/add-invoice)
```
lncli addinvoice
{
    "r_hash": "b5feeb250fc6d5f658a753a28a5f71506a13bdf07e9b4537ab4213170fe6e196",
    "payment_request": "lnbc1pjlxh:t7cq6cezuw",
    "add_index": "1",
    "payment_addr": "25c28a4dfa111674ab22f5dfd24075d30f51621625fd1242eeedf479717e1b26"
}
```
```
node lnd-add-invoice.js
```
- `POST /v1/invoices`

---
## 2.3 [ListInvoices](https://lightning.engineering/api-docs/api/lnd/lightning/list-invoices)
```
lncli listinvoices
```
```
node lnd-list-invoices.js
```
- `GET /v1/invoices`

---
## 2.4 [LookupInvoice](https://lightning.engineering/api-docs/api/lnd/lightning/lookup-invoice)
```
lncli lookupinvoice b5feeb250fc6d5f658a753a28a5f71506a13bdf07e9b4537ab4213170fe6e196
```
```
node lnd-lookup-invoice.js b5feeb250fc6d5f658a753a28a5f71506a13bdf07e9b4537ab4213170fe6e196
```
- `GET /v1/invoice/{r_hash_str}`

---
# 3 [LNURL Documents LUDs](https://github.com/lnurl/luds)
## 3.1 [LUD-16 Lightning Adresse](https://github.com/lnurl/luds/blob/luds/16.md)
- [beat@bitagent.ch](https://bitagent.ch/.well-known/lnurlp/beat)
```
https://bitagent.ch/.well-known/lnurlp/beat
```
```
node lightning-address.js beat@bitagent.ch
```

---
## 3.2 [LUD-06 Pay Request](https://github.com/lnurl/luds/blob/luds/06.md)
```
{
    tag: "payRequest"
    callback: "https://bitagent.ch:443/.well-known/lnurlp/beat"
}
```
```
https://bitagent.ch/.well-known/lnurlp/beat?amount=1000&comment=Test
```
```
node lightning-address-pay.js beat@bitagent.ch
```
- LND [AddInvoice](https://lightning.engineering/api-docs/api/lnd/lightning/add-invoice)

---
# 4 [Nostr Implementation Possibilities NIPs](https://github.com/nostr-protocol/nips)
## 4.1 [NIP-05 Nostr Identifier](https://github.com/nostr-protocol/nips/blob/master/05.md)
- [beat@bitagent.ch](https://bitagent.ch/.well-known/nostr.json?name=beat)
```
https://bitagent.ch/.well-known/nostr.json?name=beat
```
```
{
  names: {
    beat: "c36ca730cee5de659d4c673e876ebbc128ee271df6bb328b561da8c03f3449ba"
  }
}
```

---
## 4.2 [NIP-57 Nostr Lightning Zaps](https://github.com/nostr-protocol/nips/blob/master/57.md)
- [beat@bitagent.ch](https://bitagent.ch/.well-known/lnurlp/beat)
```
https://bitagent.ch/.well-known/lnurlp/beat
```
```
{
    allowsNostr: true
    nostrPubkey: "c36ca730cee5de659d4c673e876ebbc128ee271df6bb328b561da8c03f3449ba"
}
```
- LND [LookupInvoice](https://lightning.engineering/api-docs/api/lnd/lightning/lookup-invoice)

---
# 5. LnPay Api und App
- OpenApi
- https://github.com/OAI/OpenAPI-Specification
- Generierung von Doku (und Code)

---
## 5.1 Spec ln-pay-api.yaml
- https://swagger.io/specification/v3/
- `ln-pay-api.yaml`

---
## 5.2 Doc redocly/cli / swagger-ui
- https://redocly.com/redocly-cli/
```
npx redocly build-docs ln-pay-api.yaml --output ln-pay-api.html
```
- https://swagger.io/tools/swagger-ui/
```
npx yaml2json ln-pay-api.yaml > ln-pay-api.json
```

---
## 5.3 Gen javascript
- https://openapi-generator.tech/
- Client Javascript https://openapi-generator.tech/docs/generators/javascript
```
npx @openapitools/openapi-generator-cli generate -i ln-pay-api.yaml -g javascript -o gen/javascript
```

---
## 5.4 Api und App mit expressjs
- https://expressjs.com/
```
node app.js
App listening on http://localhost:3000
```
- http://localhost:3000

---
## 5.5 End-to-End Testing mit cypress
- https://cypress.io
```
npx cypress open
npx cypress run
```

---
## 5.6 Deploy mit Render
- [How to Deploy Your Node.js Application for Free with Render](https://www.freecodecamp.org/news/how-to-deploy-nodejs-application-with-render/)
- https://lnpay.onrender.com

---
## Fragen?
