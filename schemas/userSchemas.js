const validator = require('validator')
const mongoose = require('mongoose')


let UserSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            validate: (value) => {
                return validator.isEmail(value)
            }
        },
        password: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            default: '000-000-0000'
        },
        role: {
            type: String,
            enum: ['Admin', 'Manager', 'Employee','User'],
            default:'User',
            required: true,
    
         
        },
        isActive: {
            type: Boolean,
            default: false
          },
        createdAt: {
            type: Date,
            default: Date.now
        }

    },
    {
        collection: "users",
        versionKey: false
    }
)

let userModel = mongoose.model('users', UserSchema)
module.exports = { userModel }