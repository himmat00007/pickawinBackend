require('../../db_functions');
let helpers = require('../../services/helper')
let moment = require('moment');
const md5 = require('md5');
let jwt = require('jsonwebtoken');
let ObjectId = require('mongodb').ObjectID;
let Messages = require('../users/messages')
let users = require('../../models/users/users');
const { sendEmail } = require('../../services/helper/sendEmail');

const messages = require('../admin/messages');

var _ = require('lodash')
const braintree = require('braintree');



const userUtil = {
    checkEmailExistance: async (data) => {
        let { email } = data;
        if (!helpers.validateEmail(email)) {
            return helpers.showResponse(false, Messages.INVALID_EMAIL_FORMAT, null, null, 200);
        }
        let result = await getSingleData(users, {
            email,
            password: { $ne: "" },
            status: { $ne: 2 }
        }, '');
        if (result.status) {
            return helpers.showResponse(false, Messages.EMAIL_ALREADY, null, null, 200);
        }
        return helpers.showResponse(true, Messages.NEW_USER, null, null, 200);
    },
    checkUsernameExistance: async (data) => {
        let { user_name } = data;

        let result = await getSingleData(users, {
            user_name,
            status: { $ne: 2 }
        }, '');
        console.log(result)
        if (result.status) {
            return helpers.showResponse(false, Messages.EMAIL_ALREADY, null, null, 200);
        }
        return helpers.showResponse(true, Messages.NEW_USER, null, null, 200);
    },
    forgotPasswordMail: async (data) => {
        let { email } = data;
        let otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)

        sendEmail(email, "MotivateYou===>", JSON.stringify(otp), from = "support@medilepsy.com", () => {
            return { status: true, otp: otp }
        })

        return { status: true, otp: otp }
    }
}
addVerifiedUsers = async (data) => {

    let { name, password, email, fcm_token, user_name } = data;
    let emailCheck = await userUtil.checkEmailExistance(data)
    let userCheck = await userUtil.checkUsernameExistance(data)
    if (!userCheck.status) {
        return helpers.showResponse(false, Messages.USER_NAME_ALREADY, null, null, 200);
    }
    if (!emailCheck.status) {
        return helpers.showResponse(false, Messages.EMAIL_ALREADY, null, null, 200);
    }

    let newObj = {
        name,
        email,
        user_name,
        password: md5(password),
        fcm_token,
        login_source: 'email',
        created_on: moment().unix()
    };
    let userRef = new users(newObj)
    let result = await postData(userRef);
    if (result.status) {
        let token = jwt.sign({ user_id: result.data._id, type: "User" }, process.env.API_SECRET, {
            expiresIn: process.env.JWT_EXPIRY
        });
        let response_data = { data: result.data, token };
        let other = { reg: 'new' }
        return helpers.showResponse(true, Messages.REGISTER_SUCCESS, response_data, other, 200);
    }
    return helpers.showResponse(false, Messages.REGISTER_FAILED, null, null, 200);
}
addUser = async (data) => {
    let { login_source } = data;
    if (login_source === "email") {
        let { name, password, email, fcm_token, profile_pic, user_name } = data;
        let emailCheck = await userUtil.checkEmailExistance(data)
        let userCheck = await userUtil.checkUsernameExistance(data)
        if (!userCheck.status) {
            return helpers.showResponse(false, Messages.USER_NAME_ALREADY, null, null, 200);
        }
        if (!emailCheck.status) {
            return helpers.showResponse(false, Messages.EMAIL_ALREADY, null, null, 200);
        }
        let newObj = {
            name,
            email,
            password: md5(password),
            fcm_token,
            login_source,
            profile_pic,
            created_on: moment().unix()
        };
        let userRef = new users(newObj)
        let x = await userUtil.forgotPasswordMail({ email })
        console.log(x)
        if (x) {
            if (x.status) {
                return helpers.showResponse(true, Messages.REGISTER_SUCCESS, x, {}, 200);

            }
        }

        // let result = await postData(userRef);
        // if (result.status) {
        //     let token = jwt.sign({ user_id: result.data._id }, process.env.API_SECRET, {
        //         expiresIn: process.env.JWT_EXPIRY
        //     });
        //     let response_data = { data: result.data, token };
        //     let other = { reg: 'new' }
        //     return helpers.showResponse(true, Messages.REGISTER_SUCCESS, response_data, other, 200);
        // }
        return helpers.showResponse(false, Messages.REGISTER_FAILED, null, null, 200);
    } else if (login_source === "social") {
        let { email, fcm_token, name } = data;
        let emailCheck = await getSingleData(users, { email: { $eq: email }, status: { $ne: 2 } }, '');
        if (emailCheck.status) {
            // email already exist
            let userObj = {
                login_source,
                fcm_token,
                name,
                updated_on: moment().unix()
            }
            let response = await updateData(users, userObj, ObjectId(emailCheck.data._id));
            if (response.status) {
                let token = jwt.sign({ user_id: response.data._id, type: response.data.type }, process.env.API_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY
                });
                let response_data = { data: response.data, token };
                let other = { reg: 'updated' }
                return helpers.showResponse(true, Messages.REGISTER_SUCCESS, response_data, other, 200);
            }
            return helpers.showResponse(false, Messages.REGISTER_FAILED, null, null, 200);
        } else {
            let newObj = {
                email,
                fcm_token,
                name,
                login_source,
                created_on: moment().unix()
            };
            let userRef = new users(newObj)
            let result = await postData(userRef);
            if (result.status) {
                let token = jwt.sign({ user_id: result.data._id, type: result.data.type }, process.env.API_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY
                });
                let response_data = { data: result.data, token };
                let other = { reg: 'new' }
                return helpers.showResponse(true, Messages.REGISTER_SUCCESS, response_data, other, 200);
            }
            return helpers.showResponse(false, Messages.REGISTER_FAILED, null, null, 200);
        }
    } else if (login_source === "apple") {
        let { auth_token, fcm_token, name } = data;
        let authTokenCheck = await getSingleData(users, { auth_token: { $eq: auth_token }, status: { $ne: 2 } }, '');
        if (auth_token && authTokenCheck.status) {
            // auth token already exist
            let userObj = {
                login_source,
                fcm_token,
                name,
                updated_on: moment().unix()
            }
            let response = await updateData(users, userObj, ObjectId(authTokenCheck.data._id));
            if (response.status) {
                let token = jwt.sign({ user_id: response.data._id, type: response.data.type }, process.env.API_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY
                });
                let response_data = { data: response.data, token };
                let other = { reg: 'updated' }
                return helpers.showResponse(true, Messages.REGISTER_SUCCESS, response_data, other, 200);
            }
            return helpers.showResponse(false, Messages.REGISTER_FAILED, null, null, 200);
        } else {
            // new auth token
            let { auth_token, fcm_token, email, name } = data;
            let emailCheck = await getSingleData(users, { email: { $eq: email }, status: { $ne: 2 } }, '');
            if (emailCheck.status) {
                // email already exist
                let userObj = {
                    login_source,
                    fcm_token,
                    auth_token,
                    name: name,
                    updated_on: moment().unix()
                }
                let response = await updateData(users, userObj, ObjectId(emailCheck.data._id));
                if (response.status) {
                    let token = jwt.sign({ user_id: response.data._id, type: response.data.type }, process.env.API_SECRET, {
                        expiresIn: process.env.JWT_EXPIRY
                    });
                    let response_data = { data: response.data, token };
                    console.log(response_data)
                    let other = { reg: 'updated' }
                    return helpers.showResponse(true, Messages.REGISTER_SUCCESS, response_data, other, 200);
                }
                return helpers.showResponse(false, Messages.REGISTER_FAILED, null, null, 200);
            } else {
                let { name, email, fcm_token } = data;

                let newObj = {
                    name,
                    email,
                    fcm_token,
                    login_source,
                    auth_token,
                    created_on: moment().unix()
                };
                let userRef = new users(newObj)
                let result = await postData(userRef);
                if (result.status) {
                    let token = jwt.sign({ user_id: result.data._id, type: result.data.type }, process.env.API_SECRET, {
                        expiresIn: process.env.JWT_EXPIRY
                    });
                    let response_data = { data: result.data, token };
                    let other = { reg: 'new' }
                    return helpers.showResponse(true, Messages.REGISTER_SUCCESS, response_data, other, 200);
                }
                return helpers.showResponse(false, Messages.REGISTER_FAILED, null, null, 200);
            }
        }
    }
}

getUserDetail = async (user_id) => {

    let queryObject = { _id: ObjectId(user_id), status: 1 };
    let result = await getSingleData(users, queryObject, null, "motivation_fields.motivation_field_id plan_id")
    console.log(result)
    if (result.status) {
        let other = ""
        return helpers.showResponse(true, 'Success', result.data, other, 200);
    }
    return helpers.showResponse(false, 'Unauthorized user', null, null, 200);
}


signIn = async (data) => {
    let { email, password, fcm_token } = data;

    let queryObject = {
        email,
        password: md5(password),
        status: { $eq: 1 }
    }
    let result = await getSingleData(users, queryObject, '-password', "motivation_fields.motivation_field_id plan_id");

    if (result.status) {
        let update = await updateData(users, { fcm_token, updated_on: moment().unix() }, ObjectId(result.data._id));


        if (update.status) {
            let token = jwt.sign({ user_id: result.data._id, type: result.data.type }, process.env.API_SECRET, {
                expiresIn: process.env.JWT_EXPIRY
            });
            let data = { data: result.data, token };
            return helpers.showResponse(true, Messages.LOGIN_SUCCESS, data, null, 200);
        }
        return helpers.showResponse(false, Messages.LOGIN_FAILED, null, null, 200);
    }
    return helpers.showResponse(false, Messages.LOGIN_FAILED, null, null, 200);
}

forgotPasswordMail = async (data) => {
    let { email } = data;
    let otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)
    let UserData = {
        otp: otp.toString(),
        updated_at: moment().unix()
    }
    let Count = await getCount(users, { email: email.toLowerCase(), login_source: "email", status: { $ne: 2 } })
    if (Count.data == 0) {
        return helpers.showResponse(false, "Email is Not Registred With Us", null, null, 200);
    }
    let result = await updateByQuery(users, UserData, { email: email.toLowerCase(), login_source: "email", status: { $ne: 2 } });
    if (result.status) {
        // email sent code here
        sendEmail(email, "PickAwins", JSON.stringify(otp), null, () => {
            return helpers.showResponse(true, Messages.FP_EMAIL_SENT, null, null, 200);
        })
        return helpers.showResponse(true, Messages.FP_EMAIL_SENT, null, null, 200);
    }
    return helpers.showResponse(false, Messages.EMAIL_ERROR, null, null, 204);
}
verifyOtp = async (data) => {

    let { otp, email } = data;
    console.log(otp)
    let UserData = {
        otp: otp,
        updated_at: moment().unix()
    }
    let Count = await getCount(users, { email: email.toLowerCase(), login_source: 'email', otp: otp, status: { $ne: 2 } })
    if (Count.data == 0) {
        return helpers.showResponse(false, "Invalid otp", null, null, 200);
    }
    console.log(Count)
    console.log(Count)
    let result = await updateByQuery(users, UserData, { email: email.toLowerCase(), login_source: 'email', otp: otp, status: { $ne: 2 } });
    console.log(result)
    if (result.status) {
        return helpers.showResponse(true, 'Otp Verified', null, null, 200);
    }
    return helpers.showResponse(false, Messages.INVALID_OTP, null, null, 203);
}
forgotChangePassword = async (data) => {
    let { email, password, otp } = data;
    let UserData = {
        otp: "",
        password: md5(password),
        updated_at: moment().unix()
    }
    let Count = await getCount(users, { email: email.toLowerCase(), login_source: 'email', otp: otp, status: { $ne: 2 } })
    if (Count.data == 0) {
        return helpers.showResponse(false, "Error Occured", null, null, 200);
    }
    let result = await updateByQuery(users, UserData, { email: email.toLowerCase(), login_source: 'email', status: { $ne: 2 }, otp: otp });
    if (result.status) {
        return helpers.showResponse(true, Messages.PASSWORD_CHANGED, null, null, 200);
    }
    return helpers.showResponse(false, Messages.INVALID_OTP, null, null, 203);
}
updateProfile = async (data) => {
    let { _id } = data
    if (data.password) {
        data.password = md5(data.password)
    }
    if (data.email) {
        delete data.email
    }
    if (data.created_on) {
        delete data.created_on
    }
    data.updated_on = moment().unix()
    let response = await updateData(users, data, ObjectId(_id));
    if (response.status) {
        return helpers.showResponse(true, 'Success', response.data, null, 200);
    }
    return helpers.showResponse(false, Messages.USER_UPDATE_FAILED, null, null, 304);
}

module.exports = {
    addUser,
    addVerifiedUsers,
    getUserDetail,
    signIn,
    forgotChangePassword,
    verifyOtp,
    forgotPasswordMail,
    updateProfile,
}
