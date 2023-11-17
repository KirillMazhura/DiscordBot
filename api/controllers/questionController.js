const mongoose = require('mongoose')
const Question = require('../models/questionModel.js')

exports.list_of_questions = async function(req, res) {
    const questions = await Question.find({});
    res.json(questions)
}