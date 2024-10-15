const express = require("express");
const collection = require("./mongo");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose'); 

app.use(bodyParser.json()); 
app.use(express.static(__dirname))
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("CORS is working");
});

app.post("/", async (req, res) => {
    const { username, password } = req.body;
    console.log("Received username:", username);
    console.log("Received password:", password);

    try {
        const admin = await collection.findOne({username: username });
        if (admin) {
            // Check if the password matches
            if (admin.password === password) {
                res.json("exist");
            } else {
                res.json("wrong password");
            }
        } else {
            res.json("notexist");
        }
    } catch (e) {
        console.error(e); 
        res.json("notexist");
    }
});

app.listen(8000, () => {
    console.log("Server running on port 8000");
});

const userSchema = new mongoose.Schema({
    username : String,
    password : String,
    status: Boolean, 
    createdAt: Date, 
    updatedAt: Date,
});

const User = mongoose.model('users', userSchema);
	
app.post('/users', async (request, response) => {
    const user = new User({
        username : request.body.username,
        password : request.body.password,
        status : request.body.status, 
        createdAt: request.body.createdAt,
        updatedAt: request.body.updatedAt
    });
    const newItem = await user.save();
    response.status(201).json({scuccess:true});
});

app.get('/users', async (request, response) => {
    const users = await User.find();
    response.status(200).json(users);
});

app.get('/users/:id', async (request, response) => {
    const user = await User.findById(request.params.id);
    response.status(200).json(user);
});

app.put('/users/:id', async (request, response) => {
    const userId = request.params.id;
    
    // Fetch the user from the database
    const user = await User.findById(userId);
    
    if (!user) {
        return response.status(404).json({ message: "User not found" });
    }
    
    // Update only the fields that are being changed
    user.username = request.body.username;
    user.password = request.body.password;
    user.status = request.body.status;
    user.updatedAt = request.body.updatedAt; // Update only this field

    const updatedItem = await user.save();
    response.status(200).json(updatedItem);
});
	
app.delete('/users/:id', async (request, response) => {
    const userId = request.params.id;
    // Fetch the user from the database
    const user = await User.findById(userId);
    await user.deleteOne();
    response.status(200).json({ message : 'Deleted item' });
});


