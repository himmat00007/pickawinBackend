var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Users = new Schema({
    name: {
        type: String,
        default: ''
    },
    user_name: {
        type: String,
        default: ''
    },
    profile_pic: {
        type: String,
        default: 'default.png'
    },
    email: {
        type: String,
        default: ''
    },
    cover_pic: {
        type: String,
        default: 'cover.png'
    },
    dob: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    login_source: {
        type: String,
        default: ''
    },
    plan_purchased: {
        type: Boolean,
        default: false
    },
    plan_id: {
        ref: 'plans',
        type: mongoose.Schema.Types.ObjectId,
    },
    about_me: {
        type: String,
        default: 'This is about me'
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    status: {
        type: Number,
        default: 1
    },
    created_on: {
        type: Number,
        default: 0
    },
    otp: {
        type: Number,
        default: 0
    },
    updated_on: {
        type: Number,
        default: 0
    },
    notification: {
        type: Boolean,
        default: false
    },
    fcm_token: {
        type: String,
        default: ''
    },
    auth_token: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'User'
    },
    planEndDate: {
        type: String,
        default: ''
    },
    planEnd: {
        type: String,
        default: ''
    }
});
module.exports = mongoose.model('users', Users, 'users');