const mongoose = require('mongoose');

// Schema for each question
const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: String,
    imageUrl: String,
}, { collection: 'questions' }); 

// Create a model for Question
module.exports = mongoose.model('Question', questionSchema);
