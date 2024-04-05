const express = require('express')
const swaggerUi = require('swagger-ui-express');
const lnpayapijson = require('./ln-pay-api.json');
const path = require('path');
const util = require('./util');

const lnpayapihtml = 'ln-pay-api.html';
const PORT = process.env.PORT || 3000;
const url = `http://localhost:${PORT}`

const app = express()
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(PORT, () => {
  console.log(`App listening on ${url}`)
})

// api redocly
app.get('/redocly', (req, res) => {
  res.sendFile(path.join(__dirname, lnpayapihtml));
})

// api swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(lnpayapijson))

// api ping
app.get('/api/ping', (req, res) => {
  res.send({ "response": "pong" })
})

// api lightning address
app.get('/api/lightning-address/:address', async (req, res) => {
  try {
    const lightningAddress = req.params.address;
    if (!util.validateLightningAddress(lightningAddress)) {
      throw new Error(util.LIGHTNING_ADDRESS_INVALID);
    }

    const options = util.getUriOptions(util.getLightningAddressUri(lightningAddress));
    const response = await util.getRequest(options);
    if (200 === response.statusCode) {
      const body = JSON.parse(response.body);
      res.send({
        payRequest: body.tag === 'payRequest',
        minSendable: body.minSendable,
        maxSendable: body.maxSendable,
        commentAllowed: body.commentAllowed,
        callback: body.callback
      });
    } else {
      throw new Error(response);
    }
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
})

// api pay request
app.post('/api/pay-request', async (req, res) => {
  try {
    const callback = req.body.callback;
    const amount = req.body.amount;
    const comment = req.body.comment;

    const options = util.getUriOptions(callback + '?amount=' + amount + '&comment=' + comment);
    const response = await util.getRequest(options);
    if (200 === response.statusCode) {
      const body = JSON.parse(response.body);
      if ("ERROR" === body.status) {
        throw new Error(JSON.stringify(body));
      } else {
        res.send({
          payRequest: body.pr,
          qrCode: await util.getQrCode(body.pr)
        });
      }
    } else {
      throw new Error(response);
    }
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
})

// app home
let errorMessage = undefined;
app.get('/', (req, res) => {
  res.render("index", { url: url, errorMessage: errorMessage });
  errorMessage = undefined;
})

// app pay with lightning address
let payData = {};
app.get('/pay/address', (req, res) => {
  payData = {};
  res.render("pay-address", { url: url, payData: payData });
})
app.post('/pay-address-response', async function (req, res) {
  try {
    payData.address = req.body.lightningAddress;
    if (req.body.button === 'submit') {
      const options = util.getUriOptions(url + '/api/lightning-address/' + payData.address);
      const response = await util.getRequest(options);
      if (200 === response.statusCode) {
        const body = JSON.parse(response.body);
        payData.addressResponse = body;
        if (payData.addressResponse.payRequest) {
          res.redirect("/pay/request");
          return;
        }
      } else {
        throw new Error(response.body);
      }
    }
  } catch (err) {
    console.error(err);
    errorMessage = err.message;
  }
  res.redirect("/");
});
app.get('/pay/request', (req, res) => {
  res.render("pay-request", { url: url, payData: payData });
})
app.post('/pay-request-response', async function (req, res) {
  try {
    payData.amount = req.body.amount;
    payData.comment = req.body.comment;
    if (req.body.button === 'submit') {
      const options = util.getUriOptions(url + '/api/pay-request', {
        callback: payData.addressResponse.callback,
        amount: payData.amount,
        comment: encodeURIComponent(payData.comment)
      });
      const response = await util.postRequest(options);
      if (200 === response.statusCode) {
        payData.payResponse = response.body;
        res.redirect("/pay/invoice");
        return;
      } else {
        throw new Error(response);
      }
    }
  } catch (err) {
    console.error(err);
    errorMessage = err.message;
  }
  res.redirect("/");
});
app.get('/pay/invoice', (req, res) => {
  res.render("pay-invoice", { url: url, payData: payData });
  payData = {};
})
