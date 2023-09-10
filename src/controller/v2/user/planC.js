const Plan = require("../../../model/Plan");


const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.status(200).json({ msg: 'success', plans: plans })
    } catch (error) {

    }
}
const getPlan = async (req, res) => {
    const plan = await Plan.findOne({ _id: req.params.planId })
    if (plan) {
        res.status(200).json({ msg: 'success', plan: plan })
    } else {
        res.status(404).json({ err: 'notFound', })
    }
}



module.exports = {
    getPlans,
    getPlan,
}