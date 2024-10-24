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
    koreanGroupName: String,
    debut: String,
    debutToFirstWin: String, 
    country: String, 
    fandom: String,
    companyCurrent: String,
    companySince: String,
    activeYears: Number, 
    status: String,
    musicShowWins: Number,
    totalAlbums: Number,
    latestAlbum: String,
    upcomingAlbum: String,
    groupIntro: String,
    groupImage: String,
    lightstickImage: String,
    socialMediaPlatforms: {
        youtube: String,
        spotify: String,
        tiktok: String,
        instagram: String,
        x: String 
    },
    groupMembers: [{ 
        name: String,
        image: String,
        memberLink: String, 
    }],
    lastEdited: Date
});

const Group = mongoose.model('groups', groupSchema);

// POST Route to create a new group
app.post('/groups', async (req, res) => {
    const groupData = {
        ...req.body,
    };

    try {
        const newGroup = new Group(groupData);
        await newGroup.save();
        res.status(201).json({ success: true, message: 'Group saved successfully!' });
    } catch (error) {
        console.error('Error saving group:', error);
        res.status(500).json({ success: false, message: 'Failed to save group' });
    }
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
        const result = await Group.findByIdAndDelete(groupId);
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
    country: String,
    nationality: String,
    fullname: String,
    birthday: String,
    age: Number,
    bloodtype: String,
    height: String, 
    group: String,
    debut: String,
    koreanName: String,
    stageName: String,
    status: String,
    trainingPeriod: String, 
    zodiacSign: String,
    activeYears: Number,
    education: String,
    fandom: String,
    funFacts: [String], 
    introduction: String,
    latestAlbum: String,
    mbti: String,
    musicShowWins: Number,
    socialMediaPlatforms: {
        youtube: String,
        spotify: String,
        tiktok: String,
        instagram: String,
        x: String 
    },
    totalAlbums: Number,
    idolImage: String, 
    lastEdited: Date,
    lightstickImage: String,
    companyCurrent: [String], 
    companySince: {
        type: Map, 
        of: String, 
        required: true,
        default: {}
    },
    language: [String] // Array of languages
});

const Idol = mongoose.model('idols', idolSchema);

// POST Route to create a new idol
app.post('/idols', async (req, res) => {
    const idolData = {
        ...req.body,
    };

    try {
        const newIdol = new Idol(idolData);
        await newIdol.save();
        res.status(201).json({ success: true, message: 'Idol saved successfully!' });
    } catch (error) {
        console.error('Error saving idol:', error);
        res.status(500).json({ success: false, message: 'Failed to save idol' });
    }
});

// GET Route to retrieve all idols
app.get('/idols', async (request, response) => {
    try {
        const idols = await Idol.find();
        response.status(200).json(idols);
    } catch (error) {
        response.status(500).json({ message: 'Error retrieving idols', error });
    }
});

// GET Route to retrieve a single idol by ID
app.get('/idols/:id', async (request, response) => {
    try {
        const idol = await Idol.findById(request.params.id);
        if (!idol) {
            return response.status(404).json({ message: 'Idol not found' });
        }
        response.status(200).json(idol);
    } catch (error) {
        response.status(500).json({ message: 'Error retrieving idol', error });
    }
});

// PUT Route to update a single idol by ID
app.put('/idols/:id', async (request, response) => {
    const idolId = request.params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(idolId)) {
        return response.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const updatedIdol = await Idol.findByIdAndUpdate(
            idolId, 
            request.body, // This will update all fields from request.body
            { new: true, runValidators: true } // new: true returns the updated document, runValidators ensures schema validation
        );
        
        if (!updatedIdol) {
            return response.status(404).json({ message: 'Idol not found' });
        }
        response.status(200).json(updatedIdol);
    } catch (error) {
        response.status(500).json({ message: 'Error updating idol', error });
    }
});

// DELETE Route to delete a single idol by ID
app.delete('/idols/:id', async (request, response) => {
    const idolId = request.params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(idolId)) {
        return response.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const deletedIdol = await Idol.findByIdAndDelete(idolId);
        if (!deletedIdol) {
            return response.status(404).json({ message: "Idol not found" });
        }
        response.status(200).json({ message: 'Idol deleted successfully' });
    } catch (error) {
        console.error("Error deleting idol:", error);
        response.status(500).json({ message: 'Error deleting idol', error });
    }
});

