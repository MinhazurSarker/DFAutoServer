const Plan = require("../../../model/Plan");

const createPlan = async (req, res) => {
    try {
        const plan = await new Plan({
            title: req.body.title,
            days: Number(req.body.days),
            price: Number(req.body.price),
        })
        await plan.save()
        res.status(200).json({ msg: 'success', plan: plan })
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}
const updatePlan = async (req, res) => {
    try {
        const plan = await Plan.findOne({ _id: req.params.planId })
        if (plan) {
            plan.title = req.body.title;
            plan.days = Number(req.body.days);
            plan.price = Number(req.body.price);
            await plan?.save()
            res.status(200).json({ msg: 'success', plan: plan })
        } else {
            res.status(404).json({ err: 'notFound', })
        }
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}
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

const deletePlan = async (req, res) => {
    try {
        await Plan.deleteOne({ _id: req.params.planId })
        res.status(200).json({ msg: 'success', })
    } catch (error) {
        res.status(500).json({ err: 'error' })
    }
}


module.exports = {
    createPlan,
    updatePlan,
    getPlans,
    getPlan,
    deletePlan,
}