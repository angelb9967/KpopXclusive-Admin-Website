const User = require('../models/users');

exports.createUser = async (req, res) => {
    const user = new User(req.body);
    try {
        const newItem = await user.save();
        res.status(201).json({ success: true, data: newItem });
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
};

exports.getAllUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
};

exports.getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
};

exports.updateUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
};

exports.deleteUserById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        const result = await User.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Deleted item" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};
