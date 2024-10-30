const Question = require('../models/questions');
const ObjectId = require('mongoose').Types.ObjectId;

exports.createQuestion = async (req, res) => {
    try {
        const newQuestion = new Question(req.body);
        await newQuestion.save();
        res.status(201).json({ success: true, message: 'Question saved successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to save question', error });
    }
};

exports.getAllQuestions = async (req, res) => {
    try {
        const allQuestions = await Question.find();
        res.status(200).json(allQuestions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving questions', error });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving question', error });
    }
};

exports.updateQuestionById = async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: 'Error updating question', error });
    }
};

exports.deleteQuestionById = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question', error });
    }
};
