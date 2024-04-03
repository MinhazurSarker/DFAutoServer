
const dotenv = require('dotenv');
dotenv.config();
const stripeInstance = require('stripe')(process.env.STRIPE_SECRET_KEY);
module.exports = stripeInstance