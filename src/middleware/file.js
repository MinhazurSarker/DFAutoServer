const multer = require("multer");
const path = require("path");
const fs = require("fs");

const imgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const imgPath = `public/images/uploads`
        fs.mkdirSync(imgPath, { recursive: true })
        cb(null, imgPath);
    },
    filename: function (req, file, cb) {
        const fileExt = path.extname(file.originalname);
        const name =
            file.originalname
                .replace(fileExt, "")
                .toLowerCase()
                .split(" ")
                .join("-") +
            "-" +
            Date.now();
        cb(null, name + fileExt);
    },
});
const brandImgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const sliderImgPath = `public/images/uploads/brands`
        fs.mkdirSync(sliderImgPath, { recursive: true })
        cb(null, sliderImgPath);
    },
    filename: function (req, file, cb) {
        const fileExt = path.extname(file.originalname);
        const name =
            file.originalname
                .replace(fileExt, "")
                .toLowerCase()
                .split(" ")
                .join("-") +
            "-" +
            Date.now();
        cb(null, name + fileExt);
    },
});

const imgUpload = multer({
    storage: imgStorage,
    limits: {
        fileSize: 5000000,
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
}).array("img");
const brandImgUpload = multer({
    storage: brandImgStorage,
    limits: {
        fileSize: 2000000,
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
}).single("img");

module.exports = {
    imgUpload,
    brandImgUpload
}
