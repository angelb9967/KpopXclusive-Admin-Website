const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: String,
    description: String,
    author: String,
    date: String,
    thumbnail: String,
    content: String,
});

module.exports = mongoose.model('news', newsSchema);
