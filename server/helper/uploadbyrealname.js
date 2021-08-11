const multer = require('multer');
// var storage = multer.diskStorage({
//     destination: 'uploads/images/products',
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
//     }
// })
var fs = require('fs');

const path = require('path')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = "./public/images/" + req.body._id;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, "./public/images/" + req.body._id);

    },
    limits: { fieldSize: 80 * 1024 * 1024 },
    filename: function (req, file, cb) {
        cb(null, file.originalname.split('.')[0] + path.extname(file.originalname)); //Appending extension
    },
});
var uploadCoverReal = multer({
    storage,
});
module.exports = { uploadCoverReal }
// var upload = multer({ storage: storage, limits: { fieldSize: 80  1024  1024 } })