const mongoose = require('mongoose');

const kpopEmojiQuizSchema = new mongoose.Schema({
    title: String,
    objective: String,
    gameSetup: {
        playerOptions: [String],
        rounds: [String],
    },
    gamePlayRules: {
        imageDisplay: [String],
        timer: [String],
        scoringSystem: [String],
    },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
}, { collection: 'quizzes' });

const KpopEmojiQuiz = mongoose.model('KpopEmojiQuiz', kpopEmojiQuizSchema); 

module.exports = KpopEmojiQuiz;
