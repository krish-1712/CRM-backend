const mongoose = require('mongoose')



let URLSchema = new mongoose.Schema(
    {
        originalURL: {
            type: String,
            required: true
        },
        shortenedURL: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    
    },
    {
        collection: "url",
        versionKey: false
    }
)

let urlModel = mongoose.model('url', URLSchema)
module.exports = { urlModel }