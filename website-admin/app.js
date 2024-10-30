const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');
const idolRoutes = require('./routes/idolRoutes');
const groupRoutes = require('./routes/groupRoutes'); 
const quizRoutes = require('./routes/quizRoutes'); 
const questionRoutes = require('./routes/questionRoutes'); 
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);  
app.use('/users', userRoutes);  
app.use('/news', newsRoutes);
app.use('/idols', idolRoutes);
app.use('/groups', groupRoutes);
app.use('/quizzes', quizRoutes);
app.use('/questions', questionRoutes);

app.get('/', (req, res) => {
    res.send("CORS is working");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = app;
