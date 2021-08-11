const multer = require('multer');
// var storage = multer.diskStorage({
//     destination: 'uploads/images/products',
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
//     }
// })
const path = require('path')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images");
    },
    limits: { fieldSize: 80 * 1024 * 1024 },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    },
});
var uploadCover = multer({
    storage,
});
module.exports = { uploadCover }
// var upload = multer({ storage: storage, limits: { fieldSize: 80  1024  1024 } })