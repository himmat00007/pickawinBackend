require('../../db_functions');
let helpers = require('../../services/helper')

var messages = require("./messages");
let moment = require('moment');
const md5 = require('md5');
let jwt = require('jsonwebtoken');
let ObjectId = require('mongodb').ObjectID;
const { json } = require('body-parser');
const { sendEmail } = require('../../services/helper/sendEmail');
const Admin = require('../../models/admin/admin');

addAdmin = async (data) => {
    let { name, password, email } = data;
    let Count = await getCount(Admin, { email: email.toLowerCase(), status: 1 })
    console.log(Count)
    if (Count.data > 0) {
        return helpers.showResponse(false, 'Admin Already Exist', null, null, 200);
    }
    let newObj = {
        name: name,
        email: email,
        password: md5(password),
        created_on: moment().unix(),
    };
    let AdminRef = new Admin(newObj)
    result = await postData(AdminRef);
    if (result.status) {
        return helpers.showResponse(true, messages.AdminAdded, result.data._id, null, 200);
    }
    return helpers.showResponse(false, messages.ServerError, null, null, 200);
}

signIn = async (data) => {
    let { email, password } = data;
    let where = {
        email: email,
        password: md5(password),
        status: { $eq: 1 }
    }
    let result = await getSingleData(Admin, where, '-password');
    console.log(result)
    if (result.status) {
        let token = jwt.sign({ user_id: result.data._id, type: result.data.type }, process.env.API_SECRET, {
            expiresIn: process.env.JWT_EXPIRY
        });
        let data = { token: token, time: process.env.JWT_EXPIRY };
        return helpers.showResponse(true, messages.AdminLogged, data, null, 200);
    }
    return helpers.showResponse(false, messages.invalidCred, null, null, 200);
}
getUserDetail = async (user_id) => {
    let queryObject = { _id: ObjectId(user_id), status: { $ne: 2 } };
    let result = await getSingleData(Admin, queryObject, "-password")
    console.log(result)
    if (result.status) {
        let other = ""
        return helpers.showResponse(true, messages.Sucess, result.data, other, 200);
    }
    return helpers.showResponse(false, "Invalid User", null, null, 200);
}
updateUserProfile = async (data, user_id) => {
    if (data.password) {
        data.password = md5(data.password)
    }
    if (data.email) {
        delete data.email
    }
    if (data.created_on) {
        delete data.created_on
    }
    let response = await updateData(Admin, data, ObjectId(user_id));
    if (response.status) {
        return helpers.showResponse(true, messages.UpdatedProfile, response.data, null, 200);
    }
    return helpers.showResponse(false, Messages.USER_UPDATE_FAILED, null, null, 304);
}



forgotChangePassword = async (data) => {
    let { otp, email, password } = data;
    let UserData = {
        otp: "",
        password: md5(password),
        updated_at: moment().unix()
    }
    let Count = await getCount(Admin, { email: email.toLowerCase(), otp: otp, status: { $ne: 2 } })
    if (Count.data == 0) {
        return helpers.showResponse(false, "Invalid Otp", null, null, 200);
    }
    let result = await updateByQuery(Admin, UserData, { email: email, otp: otp, status: { $ne: 2 } });
    if (result.status) {
        return helpers.showResponse(true, "Password Changed", null, null, 200);
    }
    return helpers.showResponse(false, "Invalid Otp", null, null, 203);
}
forgotPasswordMail = async (data) => {
    let { email } = data;
    let otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)
    let UserData = {
        otp: otp.toString(),
        updated_at: moment().unix()
    }
    let Count = await getCount(Admin, { email: email.toLowerCase() })
    if (Count.data == 0) {
        return helpers.showResponse(false, "Email is Not Registred With Us", null, null, 200);
    }
    let result = await updateByQuery(Admin, UserData, { email: email, status: { $ne: 2 } });
    if (result.status) {
        // email sent code here
        let x = await sendEmail(email, "SafetyHeard OTP===>", JSON.stringify(otp), from = "support@medilepsy.com", () => {
            // return helpers.showResponse(true, 'Email sent', null, null, 200);
        })
        console.log(x)
        if (x) {
            return helpers.showResponse(true, "Email Sent", null, null, 200);

        }
        else {
            return helpers.showResponse(true, "Error while sending email", null, null, 200);

        }
    }
    return helpers.showResponse(false, 'Error while sending email', null, null, 204);
}
module.exports = {
    addAdmin,
    getUserDetail,
    signIn,
    forgotChangePassword,
    forgotPasswordMail,
    updateUserProfile,
    
}