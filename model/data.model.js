const mongoose = require('mongoose')

const schema = mongoose.Schema({
    headline: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const model = mongoose.model('New', schema)

module.exports = {model}