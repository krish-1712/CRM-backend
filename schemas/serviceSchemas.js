const mongoose = require('mongoose')


let serviceSchema = new mongoose.Schema(
    {
        userId: {
            type:String,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: '000-000-0000'
        },
        status: {
            type: String,
            enum: ['Open', 'Closed'], // define the allowed enum values
            required: true
          },

        createdAt: {
            type: Date,
            default: Date.now
        }

    },
    {
        collection: "Service",
        versionKey: false
    }
)

let ServiceModel = mongoose.model('Service', serviceSchema)
module.exports = { ServiceModel }