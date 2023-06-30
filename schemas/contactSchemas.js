const validator = require('validator')
const mongoose = require('mongoose')


let contactSchema = new mongoose.Schema(
    {

        userId: {
            type: String,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        phonenumber: {
            type: String,
            default: '000-000-0000'
        },

        createdAt: {
            type: Date,
            default: Date.now
        }

    },
    {
        collection: "Contact",
        versionKey: false
    }
)

let contactModel = mongoose.model('Contact', contactSchema)
module.exports = { contactModel }