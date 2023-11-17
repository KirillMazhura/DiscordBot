const question = require("./api/controllers/questionController.js")

module.exports = app => {
    app.get(question.list_of_questions)
}