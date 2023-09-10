const History = require("../../../model/History")

const getHistory = async (req, res) => {
    const page = req.params.page
    try {
        const totalDocs = await History.countDocuments({ user: req.params.userId });
        const pages = Math.ceil(totalDocs / 25)
        const histories = await History.find({ user: req.params.userId })
            .populate('product', ' name img serial')
            .sort({ createdAt: -1 })
            .skip(25 * (page - 1))
            .limit(25)
        res
            .status(200)
            .json({ msg: "success", array: histories, current: page, pages: pages });
    } catch (err) {
        res.status(500).json({ err: 'error' })
    }
}
const deleteHistory = async (req, res) => {
    try {
        await History.deleteOne({ _id: req.params.id, })

        res
            .status(200)
            .json({ msg: "success" });
    } catch (err) {
        res.status(500).json({ err: 'error' })
    }
}
const clearHistory = async (req, res) => {
    try {
        await History.deleteMany({ user: req.params.userId })
        console.log('deleted')
        res
            .status(200)
            .json({ msg: "success" });
    } catch (err) {
        res.status(500).json({ err: 'error' })
    }
}

module.exports = {
    getHistory,
    deleteHistory,
    clearHistory,
}