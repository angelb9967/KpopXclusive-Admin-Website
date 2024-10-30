const Quiz = require('../models/quiz'); 
const { ObjectId } = require('mongoose').Types;

// Create a new quiz
exports.createQuiz = async (req, res) => {
    try {
        const newQuiz = new Quiz(req.body);
        await newQuiz.save();
        res.status(201).json({ success: true, message: 'Quiz saved successfully!' });
    } catch (error) {
        console.error('Error saving quiz:', error);
        res.status(500).json({ success: false, message: 'Failed to save quiz' });
    }
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving quizzes', error });
    }
};

// Get a single quiz by ID
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving quiz', error });
    }
};

// Update a single quiz by ID
exports.updateQuizById = async (req, res) => {
    const quizId = req.params.id;

    if (!ObjectId.isValid(quizId)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ message: 'Error updating quiz', error });
    }
};

// Delete a single quiz by ID
exports.deleteQuizById = async (req, res) => {
    const quizId = req.params.id;

    if (!ObjectId.isValid(quizId)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const result = await Quiz.findByIdAndDelete(quizId);
        if (!result) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.status(200).json({ message: 'Quiz deleted' });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        res.status(500).json({ message: 'Error deleting quiz', error });
    }
};
