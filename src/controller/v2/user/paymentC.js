const Plan = require("../../../model/Plan")
const User = require("../../../model/User")
const dotenv = require('dotenv');
const moment = require('moment');
const { failed, successful } = require('../../../utils/html');
const stripeInstance = require("../../../services/stripeS");
dotenv.config();
const stripe = stripeInstance
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET || '';


const upgradeAccount = async (req, res) => {
    const resultUrl = process.env.RESULT_URL;
    const closeUrl = process.env.CLOSE_URL;

    try {
        const user = await User.findOne({ _id: req.body.requesterId })
        const plan = await Plan.findOne({ _id: req.params.planId })

        if (user && plan) {
            if (user.stripeCustomerId && user.stripeCustomerId !== '' && user.stripeCustomerId !== null && user.stripeCustomerId !== undefined) {
                const customer = await stripe.customers.retrieve(user.stripeCustomerId)
                if (customer.id) {

                    const session = await stripe.checkout.sessions.create({
                        payment_method_types: ['card'],
                        line_items: [
                            {
                                price_data: {
                                    currency: 'usd',
                                    product_data: {
                                        name: ` ${plan.title}`,
                                    },
                                    unit_amount: plan.price * 100,
                                },
                                quantity: 1,
                            },
                        ],
                        mode: 'payment',
                        success_url: resultUrl + `/success?session_id={CHECKOUT_SESSION_ID}&metadata[planId]=${plan._id}&metadata[userId]=${user._id}`,
                        cancel_url: resultUrl + `/cancel?session_id={CHECKOUT_SESSION_ID}&metadata[planId]=${plan._id}&metadata[userId]=${user._id}`,
                        customer: user.stripeCustomerId,
                        client_reference_id: user?.id,
                        metadata: {
                            planId: plan?._id,
                            userId: user?._id,
                            // trxId: trx._id,
                        }
                    });
                    res.status(200).json({ message: "success", url: session.url, closeUrl: closeUrl })
                } else {
                    const customer = await stripe.customers.create({
                        email: user.email,
                        name: user.name,
                        phone: user.phone,
                    })
                    user.stripeCustomerId = customer.id;
                    await user.save()
                    const session = await stripe.checkout.sessions.create({
                        payment_method_types: ['card',],
                        line_items: [
                            {
                                price_data: {
                                    currency: 'usd',
                                    product_data: {
                                        name: ` ${plan.title}`,
                                    },
                                    unit_amount: plan.price * 100,
                                },
                                quantity: 1,
                            },
                        ],
                        mode: 'payment',
                        success_url: resultUrl + `/success?session_id={CHECKOUT_SESSION_ID}&metadata[planId]=${plan._id}&metadata[userId]=${user._id}`,
                        cancel_url: resultUrl + `/cancel?session_id={CHECKOUT_SESSION_ID}&metadata[planId]=${plan._id}&metadata[userId]=${user._id}`,
                        customer: customer.id,
                        client_reference_id: user?.id,
                        metadata: {
                            planId: plan?._id,
                            userId: user?._id,
                            // trxId: trx._id,
                        }
                    });
                    res.status(200).json({ message: "success", url: session.url, closeUrl: closeUrl })
                }

            } else if (!user.stripeCustomerId || user.stripeCustomerId == '' || user.stripeCustomerId == null || user.stripeCustomerId == undefined) {
                const customer = await stripe.customers.create({
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                })
                user.stripeCustomerId = customer.id;
                await user.save()
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card',],
                    line_items: [
                        {
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: ` ${plan.title}`,
                                },
                                unit_amount: plan.price * 100,
                            },
                            quantity: 1,
                        },
                    ],
                    mode: 'payment',
                    success_url: resultUrl + `/success?session_id={CHECKOUT_SESSION_ID}&metadata[planId]=${plan._id}&metadata[userId]=${user._id}`,
                    cancel_url: resultUrl + `/cancel?session_id={CHECKOUT_SESSION_ID}&metadata[planId]=${plan._id}&metadata[userId]=${user._id}`,
                    customer: customer.id,
                    client_reference_id: user?.id,
                    metadata: {
                        planId: plan?._id,
                        userId: user?._id,
                        // trxId: trx._id,
                    }
                });
                res.status(200).json({ message: "success", url: session.url, closeUrl: closeUrl })
            }

        } else {
            res.status(400).json({ message: "User or plan not found" })
        }
    } catch (error) {

    }
}

const callback = async (req, res) => {
    const status = req.params.status;
    const sessionID = req.query.session_id;
    console.log(req.query)

    if (status === 'success') {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionID);
            console.log(session)
            const user = await User.findOne({ _id: req.query.metadata.userId })
            const plan = await Plan.findOne({ _id: req.query.metadata.planId })
            if (user && plan) {
                if (session.payment_status === 'paid' && session.status === 'complete') {
                    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
                    const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
                    const subscriptionEndDate = moment().add(plan.days, 'days').valueOf();
                    user.subEnd = Number(subscriptionEndDate);
                    user.currentPlan = plan._id;
                    user.autoRenew = true;
                    user.stripePaymentMethod = `pm_card_${paymentMethod.card.brand}`;
                    user.role = 'viewer';
                    await user.save()
                    res.redirect(`/api/v2/message?type=successful&logout=yes`);
                } else {
                    res.redirect('/api/v2/message?type=failed');
                }
            } else {
                res.redirect('/api/v2/message?type=failed')

            }
        } catch (error) {
            console.error('Error retrieving session details:', error);
            res.redirect('/api/v2/message?type=failed');
        }
    } else {
        res.redirect('/api/v2/message?type=failed')
    }
}
const resultMessage = async (req, res) => {
    if (req.query.type === 'successful') {
        res.send(successful);
    } else {
        res.send(failed)
    }
}
module.exports = {
    upgradeAccount,
    callback,
    resultMessage,
}