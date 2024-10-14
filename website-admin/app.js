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
