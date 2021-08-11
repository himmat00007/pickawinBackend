const Admin = require('../../utils/admin/admin')
require('../../db_functions');
let helpers = require('../../services/helper');
addAdmin = async (req, res) => {
    let requiredFields = ['name', 'email', 'password'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }

    let result = await Admin.addAdmin(req.body);
    return helpers.showOutput(res, result, result.code);
}
addMotivationFields = async (req, res) => {
    let requiredFields = ['name'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }

    let result = await Admin.addMotivationFields(req.body);
    return helpers.showOutput(res, result, result.code);
}
addCategories = async (req, res) => {
    let requiredFields = ['name', 'motivation_id'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }

    let result = await Admin.addCategories(req.body);
    return helpers.showOutput(res, result, result.code);
}
addSubCategories = async (req, res) => {
    let requiredFields = ['name', 'category_id'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }

    let result = await Admin.addSubCategories(req.body);
    return helpers.showOutput(res, result, result.code);
}
addPictureCategories = async (req, res) => {
    let requiredFields = ['name', 'subcategory_id', 'caption'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }

    let result = await Admin.addPictureCategories(req.body);
    return helpers.showOutput(res, result, result.code);
}

addPlans = async (req, res) => {
    let requiredFields = ['name', 'type', 'plan_benefits', "duration", "price"];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }

    let result = await Admin.addPlans(req.body);
    return helpers.showOutput(res, result, result.code);
}
addCoach = async (req, res) => {
    let requiredFields = ['name', 'email'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }

    let result = await Admin.addCoach(req.body);
    return helpers.showOutput(res, result, result.code);
}
addCoachVideo = async (req, res) => {
    let requiredFields = ['name', 'caption', 'title',"coach_id"];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }

    let result = await Admin.addCoachVideo(req.body);
    return helpers.showOutput(res, result, result.code);
}
updateCoach=async (req, res) => {
    let requiredFields = ['_id'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }
    let result = await Admin.updateCoach(req.body);
    return helpers.showOutput(res, result, result.code);
}
addVideosCategories = async (req, res) => {
    let requiredFields = ['subcategory_id', 'caption'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }
    let result = await Admin.addVideosCategories(req.body);
    return helpers.showOutput(res, result, result.code);
}
addVideo = async (req, res) => {
    let requiredFields = ['subcategory_id', 'name', "video_id", "type"];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }

    let result = await Admin.addVideo(req.body);
    return helpers.showOutput(res, result, result.code);
}
signIn = async (req, res) => {
    let requiredFields = ['email', 'password'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }

    let result = await Admin.signIn(req.body);
    return helpers.showOutput(res, result, result.code);
}
getUserDetail = async (req, res) => {

    let r_id = req.decoded.user_id;
    console.log(r_id)
    if (!r_id) {
        return helpers.showOutput(res, helpers.showResponse(false, 'invalid user'), 403);
    }
    let result = await Admin.getUserDetail(r_id);
    return helpers.showOutput(res, result, result.code);
}

updateUserProfile = async (req, res) => {

    let user_id = req.decoded.user_id;
    console.log(user_id)
    if (!user_id) {
        return helpers.showOutput(res, helpers.showResponse(false, 'Invalid User'), 403);
    }
    let result = await Admin.updateUserProfile(req.body, user_id);
    return helpers.showOutput(res, result, result.code);
}

uploadImage = async (req, res, next) => {
    const file = req.file
    if (!file) {
        return helpers.showOutput(res, helpers.showResponse(false, "No File Selected", []), 203);
    }
    if (file) {
        console.log(file)
        return helpers.showOutput(res, helpers.showResponse(true, "file uploaded", file), 203);

    }
    // res.send(file)
}
sendEmail = async (req, res) => {

    let requiredFields = ['email'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }
    let result = await Admin.forgotPasswordMail(req.body);
    return helpers.showOutput(res, result, result.code);
}

confirmOtp = async (req, res) => {

    let requiredFields = ['otp', 'password', 'email'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }
    let result = await Admin.forgotChangePassword(req.body);
    return helpers.showOutput(res, result, result.code);
}
module.exports = {
    addAdmin,
    signIn,
    getUserDetail,
    updateUserProfile,
    uploadImage,
    sendEmail,
    confirmOtp,
    addMotivationFields,
    addCategories,
    addSubCategories,
    addPictureCategories,
    addVideosCategories,
    addVideo,
    addPlans,
    addCoach,
    addCoachVideo,
    updateCoach
}