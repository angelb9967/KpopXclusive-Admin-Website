const Group = require('../models/group'); 
const { ObjectId } = require('mongoose').Types;

// Create a new group
exports.createGroup = async (req, res) => {
    try {
        const newGroup = new Group(req.body);
        await newGroup.save();
        res.status(201).json({ success: true, message: 'Group saved successfully!' });
    } catch (error) {
        console.error('Error saving group:', error);
        res.status(500).json({ success: false, message: 'Failed to save group' });
    }
};

// Get all groups
exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving groups', error });
    }
};

// Get a single group by ID
exports.getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving group', error });
    }
};

// Update a single group by ID
exports.updateGroupById = async (req, res) => {
    const groupId = req.params.id;

    if (!ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: 'Error updating group', error });
    }
};

// Delete a single group by ID
exports.deleteGroupById = async (req, res) => {
    const groupId = req.params.id;

    if (!ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const result = await Group.findByIdAndDelete(groupId);
        if (!result) {
            return res.status(404).json({ message: "Group not found" });
        }
        res.status(200).json({ message: 'Group deleted' });
    } catch (error) {
        console.error("Error deleting group:", error);
        res.status(500).json({ message: 'Error deleting group', error });
    }
};

