const mongoose = require("mongoose")
const connection = mongoose.connect('mongodb+srv://surajkumar:suraj8700@cluster0.cizqkq8.mongodb.net/?retryWrites=true&w=majority')

module.exports = {
    connection
}