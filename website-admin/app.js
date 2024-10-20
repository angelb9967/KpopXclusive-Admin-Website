const express = require("express");
const collection = require("./mongo");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

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
        const admin = await collection.findOne({ username: username });
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

/////////////////////////////////// USERS 

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    status: String,
    createdAt: Date,
    updatedAt: Date,
});

const User = mongoose.model('users', userSchema);

app.post('/users', async (request, response) => {
    const user = new User({
        username: request.body.username,
        password: request.body.password,
        status: request.body.status,
        createdAt: request.body.createdAt,
        updatedAt: request.body.updatedAt
    });
    const newItem = await user.save();
    response.status(201).json({ success: true, data: newItem });
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
    console.log(`Attempting to delete user with ID: ${userId}`);
    // Fetch the user from the database
    const user = await User.findById(userId);
    await user.deleteOne();
    response.status(200).json({ message: 'Deleted item' });
});

/////////////////////////////////// GROUPS 

const groupSchema = new mongoose.Schema({
    groupName: String,
    lastEdited: Date,
});

const Group = mongoose.model('groups', groupSchema);

app.post('/groups', async (request, response) => {
    const group = new Group({
        groupName: request.body.groupName,
        lastEdited: request.body.lastEdited
    });
    const newItem = await group.save();
    response.status(201).json({ success: true, data: newItem });
});

app.get('/groups', async (request, response) => {
    const groups = await Group.find();
    response.status(200).json(groups);
});

app.get('/groups/:id', async (request, response) => {
    const group = await Group.findById(request.params.id);
    response.status(200).json(group);
});

app.put('/groups/:id', async (request, response) => {
    const groupId = request.params.id;

    // Fetch the user from the database
    const group = await Group.findById(groupId);

    if (!group) {
        return response.status(404).json({ message: "Group not found" });
    }

    // Update only the fields that are being changed
    group.groupName = request.body.groupName;
    group.lastEdited = request.body.lastEdited;

    const updatedItem = await group.save();
    response.status(200).json(updatedItem);
});

app.delete('/groups/:id', async (request, response) => {
    const groupId = request.params.id;
    console.log(`Attempting to delete group with ID: ${groupId}`);

    // Validate ObjectId format
    if (!ObjectId.isValid(groupId)) {
        return response.status(400).json({ message: "Invalid ID format" });
    }

    try {
        // Convert the ID to ObjectId
        const result = await Group.findByIdAndDelete(ObjectId(groupId));
        if (!result) {
            return response.status(404).json({ message: "Group not found" });
        }
        response.status(200).json({ message: 'Group deleted' });
    } catch (error) {
        console.error("Error deleting group:", error);
        response.status(500).json({ message: 'Error deleting group', error });
    }
});

/////////////////////////////////// IDOLS

const idolSchema = new mongoose.Schema({
    idolName: String,
    lastEdited: Date,
});

const Idol = mongoose.model('idols', idolSchema);

app.post('/idols', async (request, response) => {
    const idol = new Idol({
        idolName: request.body.idolName,
        lastEdited: request.body.lastEdited
    });
    const newItem = await idol.save();
    response.status(201).json({ success: true, data: newItem });
});

app.get('/idols', async (request, response) => {
    const idols = await Idol.find();
    response.status(200).json(idols);
});

app.get('/idols/:id', async (request, response) => {
    const idol = await Idol.findById(request.params.id);
    response.status(200).json(idol);
});

app.put('/idols/:id', async (request, response) => {
    const idolId = request.params.id;

    // Fetch the user from the database
    const idol = await Idol.findById(idolId);

    if (!idol) {
        return response.status(404).json({ message: "Idol not found" });
    }

    // Update only the fields that are being changed
    idol.idolName = request.body.idolName;
    idol.lastEdited = request.body.lastEdited;

    const updatedItem = await idol.save();
    response.status(200).json(updatedItem);
});

app.delete('/idols/:id', async (request, response) => {
    const idolId = request.params.id;
    console.log(`Attempting to delete idol with ID: ${idolId}`);

    // Validate ObjectId format
    if (!ObjectId.isValid(idolId)) {
        return response.status(400).json({ message: "Invalid ID format" });
    }

    try {
        // Convert the ID to ObjectId
        const result = await Idol.findByIdAndDelete(ObjectId(idolId));
        if (!result) {
            return response.status(404).json({ message: "Idol not found" });
        }
        response.status(200).json({ message: 'Idol deleted' });
    } catch (error) {
        console.error("Error deleting idol:", error);
        response.status(500).json({ message: 'Error deleting idol', error });
    }
});