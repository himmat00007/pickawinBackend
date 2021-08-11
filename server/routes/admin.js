var express = require('express');
var router = express.Router();

var Controller = require('../controller/admin/admin');
const { uploadCover } = require('../helper/upload');
var middleware = require('../middleware/index')

// student Routes
router.post('/signup', Controller.addAdmin);
router.post('/signIn', Controller.signIn);
router.post('/addMotivationFields', middleware.checkAdminToken,Controller.addMotivationFields);
router.post('/addCategories', middleware.checkAdminToken,Controller.addCategories);
router.post('/addSubCategories', middleware.checkAdminToken,Controller.addSubCategories);
router.post('/addPicturesCategories', middleware.checkAdminToken,Controller.addPictureCategories);
router.post('/addVideosCategories', middleware.checkAdminToken,Controller.addVideosCategories);
router.post('/addVideo', middleware.checkAdminToken,Controller.addVideo);
router.post('/addPlan', middleware.checkAdminToken,Controller.addPlans);
router.post('/addCoach', middleware.checkAdminToken,Controller.addCoach);
router.post('/addCoachVideo', middleware.checkAdminToken,Controller.addCoachVideo);
router.post('/updateCoach', middleware.checkAdminToken,Controller.updateCoach);





router.post('/uploadFile',middleware.checkAdminToken, uploadCover.single('myFile'), Controller.uploadImage);





// router.post('/sendOtp', Controller.sendOtp);
// router.post('/verifyOtp', Controller.verifyOtp);
// router.post('/changePassword', Controller.changePasswordOtp);
// router.post('/getProfile',middleware.checkAdminToken, Controller.getProfile);
// router.post('/updateProfile',middleware.checkAdminToken, Controller.updateUserProfile);



























// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });
module.exports = router;