var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Admin = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: ''
    },
    profile_pic: {
        type: String,
        default: ''
    },
    dob: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    phoneVerified: {
        type: Number,
        default: 0
    },
    otp: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 1
    },
    created_on: {
        type: Number,
        default: 0
    },
    updated_on: {
        type: Number,
        default: 0
    },
    notification: {
        type: Boolean,
        default: true
    },
    fcm: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'admin'
    },
});
module.exports = mongoose.model('admin', Admin, 'admin');