var express = require('express');
var router = express.Router();

var Controller = require('../controller/users/users');
const { uploadCover } = require('../helper/upload');
var middleware = require('../middleware/index')

// student Routes
router.post('/signup', Controller.addUser);
router.post('/addVerified', Controller.addVerifiedUser);
router.post('/signIn', Controller.signInUser);
router.post('/sendOtp', Controller.sendOtp);
router.post('/verifyOtp', Controller.verifyOtp);
router.post('/changePassword', Controller.changePasswordOtp);
router.post('/getProfile',middleware.checkToken, Controller.getProfile);
router.post('/updateProfile',middleware.checkToken, Controller.updateUserProfile);





router.post('/uploadFile', uploadCover.single('myFile'), Controller.uploadImage);



























// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });
module.exports = router;