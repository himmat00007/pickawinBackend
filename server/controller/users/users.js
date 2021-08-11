
const Users = require('../../utils/users/index');

var helpers = require('../../services/helper/index');
let ObjectId = require('mongodb').ObjectID;

addUser = async (req, res) => {
    let requiredFields = ['login_source'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }
    let { login_source } = req.body
    if (login_source == 'email') {
        let requiredFields = ['name', 'phone', 'password', 'email','profile_pic','user_name'];
        let validator = helpers.validateParams(req, requiredFields);
        if (!validator.status) {
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
    } else if (login_source == 'social') {
        let requiredFields = ['email'];
        let validator = helpers.validateParams(req, requiredFields);
        if (!validator.status) {
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
    } else if (login_source == 'apple') {
        let requiredFields = ['auth_token'];
        let validator = helpers.validateParams(req, requiredFields);
        if (!validator.status) {
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
    } else {
        return helpers.showOutput(res, helpers.showResponse(false, "Invalid Login Source"), 203);
    }
    let result = await Users.addUser(req.body);
    return helpers.showOutput(res, result, result.code);
}
addVerifiedUser = async (req, res) => {
    let requiredFields = ['name', 'phone', 'password', 'email'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }

    let result = await Users.addVerifiedUsers(req.body);
    return helpers.showOutput(res, result, result.code);
}
signInUser = async (req, res) => {
    let requiredFields = ['email', 'password'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }

    let result = await Users.signIn(req.body);
    return helpers.showOutput(res, result, result.code);
}
sendOtp = async (req, res) => {
    let requiredFields = ['email'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }

    let result = await Users.forgotPasswordMail(req.body);
    return helpers.showOutput(res, result, result.code);
}
verifyOtp = async (req, res) => {
    let requiredFields = ['email', 'otp'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }

    let result = await Users.verifyOtp(req.body);
    return helpers.showOutput(res, result, result.code);
}

changePasswordOtp = async (req, res) => {
    let requiredFields = ['email', 'otp', 'password'];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
    }

    let result = await Users.forgotChangePassword(req.body);
    return helpers.showOutput(res, result, result.code);
}
getProfile = async (req, res) => {

    let r_id = req.decoded.user_id;
    console.log(r_id)
    if (!r_id) {
        return helpers.showOutput(res, helpers.showResponse(false, 'invalid user'), 403);
    }
    let result = await Users.getUserDetail(r_id);
    return helpers.showOutput(res, result, result.code);
}
getPlans = async (req, res) => {

    let r_id = req.decoded.user_id;
    console.log(r_id)
    if (!r_id) {
        return helpers.showOutput(res, helpers.showResponse(false, 'invalid user'), 403);
    }
    let result = await Users.getPlans();
    return helpers.showOutput(res, result, result.code);
}
getCoach = async (req, res) => {

    let r_id = req.decoded.user_id;
    console.log(r_id)
    if (!r_id) {
        return helpers.showOutput(res, helpers.showResponse(false, 'invalid user'), 403);
    }
    let result = await Users.getCoach();
    return helpers.showOutput(res, result, result.code);
}

updateUserProfile = async (req, res) => {

    let user_id = req.decoded.user_id;
    console.log(user_id)
    if (!user_id) {
        return helpers.showOutput(res, helpers.showResponse(false, 'Invalid User'), 403);
    }
    req.body._id = user_id
    let result = await Users.updateProfile(req.body, user_id);
    return helpers.showOutput(res, result, result.code);
}
uploadImage = async (req, res, next) => {
    const file = req.file
    if (!file) {
        return helpers.showOutput(res, helpers.showResponse(false, "No File Selected"), 203);
    }
    if (file) {
        console.log(file)
        return helpers.showOutput(res, helpers.showResponse(true, "file uploaded", file), 203);

    }
}
module.exports = {
    addUser,
    addVerifiedUser,
    signInUser,
    changePasswordOtp,
    sendOtp,
    verifyOtp,
    getProfile,
    updateUserProfile,
    uploadImage,
 
}