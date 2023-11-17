const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuestionSchema = new Schema({
    "question": String,
    "answers": String,
    "correctanswer": String
})

module.exports = mongoose.model("Questions", QuestionSchema)