const { isMainThread, parentPort } = require('worker_threads');
const moment = require('moment');
const User = require('../model/User');
const Plan = require('../model/Plan');
const stripeInstance = require('../services/stripeS');

const userCheck = async () => {
    try {
        const users = await User.find({ subEnd: { $lte: Date.now() }, role: { $ne: 'user' }, infinity: { $ne: true } })
        users.forEach(async (user) => {
            if (user.autoRenew == true && user.stripeCustomerId !== '' && user.stripeCustomerId !== null && user.stripeCustomerId !== undefined) {
                const plan = await Plan.findOne({ _id: user?.currentPlan })
                if (plan) {
                    const paymentIntent = await stripeInstance.paymentIntents.create({
                        customer: user.stripeCustomerId,
                        amount: plan.price * 100, // Amount in cents
                        currency: user.currency,
                        metadata: {
                            userId: user._id.toString(),
                            planId: plan._id.toString(),
                        },
                        automatic_payment_methods: {
                            enabled: true,
                            allow_redirects: 'never'
                        },
                        payment_method: user.stripePaymentMethod || 'pm_card_visa',
                    });
                    const paymentIntentConfirm = await stripeInstance.paymentIntents.confirm(paymentIntent.id);
                    if (paymentIntentConfirm.status == 'succeeded') {
                        const subscriptionEndDate = moment().add(plan.days, 'days').valueOf();
                        user.subEnd = Number(subscriptionEndDate);
                        user.role = 'viewer';
                        await user.save()
                    }
                } else {
                    user.currentPlan = undefined;
                    user.autoRenew = false;
                    user.role = 'user';
                    await user.save()
                }
            } else {
                user.currentPlan = undefined;
                user.autoRenew = false;
                user.role = 'user';
                await user.save()
            }
        })
    } catch (error) {
        console.log(error)
    }
}
if (!isMainThread && parentPort) {
    parentPort.on('message', (message) => {
        if (message === 'start') {
            userCheck();
        }
    });
}
module.exports = userCheck;
