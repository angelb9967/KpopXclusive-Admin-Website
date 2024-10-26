const News = require('../models/news');
const ObjectId = require('mongoose').Types.ObjectId;

// Controller to create a new news
exports.createNews = async (req, res) => {
    try {
        const newNews = new News(req.body);
        await newNews.save();
        res.status(201).json({ success: true, message: 'News saved successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to save news', error });
    }
};

// Controller to get all news
exports.getAllNews = async (req, res) => {
    try {
        const allNews = await News.find();
        res.status(200).json(allNews);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news', error });
    }
};

// Controller to get news by ID
exports.getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news', error });
    }
};

// Controller to update news by ID
exports.updateNewsById = async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error updating news', error });
    }
};

// Controller to delete news by ID
exports.deleteNewsById = async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(200).json({ message: 'News deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting news', error });
    }
};
