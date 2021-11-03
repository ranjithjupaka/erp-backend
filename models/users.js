const { Schema , model } = require('mongoose');

const UserSchema = new Schema(
    {
        name : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true
        },
        employeeId : {
            type : String,
            required : true
        },
        role : {
            type : String,
            enum : ['purchase','sales','admin','superadmin']
        },
        password : {
            type : String,
            required : true
        },
        resetToken : {
            type : String,
            default: ''
        },
        totalTime : {
            type : Number,
            default : 0,
        }
    },
    { timestamps : true}
);
const User = model('User', UserSchema)
module.exports = { User }