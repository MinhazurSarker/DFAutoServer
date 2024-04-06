//create an express server
const express = require('express');
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const bp = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { default: axios } = require('axios');
const corn = require("node-cron");
const ExchangeRate = require('./src/model/ExchangeRate');
const moment = require('moment');
const User = require('./src/model/User');
const Product = require('./src/model/Product');
const stripeInstance = require('./src/services/stripeS');
const Plan = require('./src/model/Plan');
mongoose.set('strictQuery', false);

const app = express();
const corsOption = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
};
let URI = process.env.MONGODB_URI || '';
let user = process.env.MONGODB_USER || '';
let pass = process.env.MONGODB_PASS || '';
let Options = {
    user: user,
    pass: pass,
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(URI, Options)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(err));
app.use(cors(corsOption));
app.use(cookieParser());
global.appRoot = path.resolve(__dirname);
dotenv.config();
app.use(bp.json({ limit: "100mb" }));
app.use(bp.urlencoded({ extended: true, limit: "100mb" }));


app.use('/.wellknown/', express.static(path.join(__dirname, "wellknown")));
app.use(express.static(path.join(__dirname, "public")));
app.disable("x-powered-by");


app.get('/', (req, res) => {
    res.status(200).json({ msg: 'OK' });
})
app.use('/privacy/', async (req, res) => {
    res.send(privacyPolicy)
})
app.use('/api/', require('./src/route/api'))
app.use('/api/v2/', require('./src/route/v2'))
app.use('/api/admin/', require('./src/route/admin'))
app.get("/*", (req, res) => {
    res.status(404).send();
});

const createNewExchangeRates = async (exchangeRateData, targetCurrency) => {
    try {
        const baseCurrencyRate = exchangeRateData.rates[targetCurrency];
        if (baseCurrencyRate === undefined) {
            console.log(`Exchange rate for ${targetCurrency} not found.`);
            return null;
        }
        const convertedRates = Object.fromEntries(
            Object.keys(exchangeRateData.rates).map(currency => [
                currency,
                exchangeRateData.rates[currency] / baseCurrencyRate
            ])
        );
        const rate = await new ExchangeRate({
            base: targetCurrency,
            rates: convertedRates
        })
        rate.save()
    } catch (error) {
        console.log(error)
    }
}

corn.schedule("0 0 0 * * *", async () => {
    const key = process.env.EXC_API_KEY;
    // const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${key}`;
    const apiUrl = `http://api.exchangeratesapi.io/v1/latest?access_key=${key}`;
    axios.get(apiUrl).then((response) => {
        createNewExchangeRates(response.data, 'USD')
        createNewExchangeRates(response.data, 'GBP')
    }).catch((error) => {
        console.log(error)
    })
});
corn.schedule("0 0 0 * * *", async () => {

    try {
        const products = await Product.find(
            { deleted: true, deletedOn: { $lte: Date.now() } },
        );
        for (let index = 0; index < products.length; index++) {
            products[index].img.map(
                (item) => {
                    fs.unlink("./public" + item, (err) => {
                        console.log(err);
                    })
                }
            )
            await Product.deleteOne({ _id: products[index]._id })
        }
    } catch (error) {
        console.log(error)
    }
});


const { Worker } = require('worker_threads');
const { privacyPolicy } = require('./src/utils/html');
corn.schedule("0 0 0 * * *", () => {
    const worker = new Worker('./src/workers/userCheckWorker.js');
    worker.on('message', (message) => {
        console.log('Worker thread:', message);
    });
    worker.postMessage('start');
});
app.listen(5000, () => {
    console.log('listening on port number 5000')
})

