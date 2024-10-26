const Idol = require('../models/idol');
const mongoose = require('mongoose');

// POST Route to create a new idol
exports.createIdol = async (req, res) => {
    try {
        console.log('Incoming idol data:', req.body);
        const newIdol = new Idol(req.body);
        await newIdol.save();
        res.status(201).json({ success: true, message: 'Idol saved successfully!' });
    } catch (error) {
        console.error('Error saving idol:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ success: false, message: 'Failed to save idol' });
    }
};

// GET Route to retrieve all idols
exports.getAllIdols = async (req, res) => {
    try {
        const idols = await Idol.find();
        res.status(200).json(idols);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving idols', error });
    }
};

// GET Route to retrieve a single idol by ID
exports.getIdolById = async (req, res) => {
    try {
        const idol = await Idol.findById(req.params.id);
        if (!idol) {
            return res.status(404).json({ message: 'Idol not found' });
        }
        res.status(200).json(idol);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving idol', error });
    }
};

// PUT Route to update a single idol by ID
exports.updateIdolById = async (req, res) => {
    const idolId = req.params.id;

    // Validate ObjectId format
    if (!mongoose.isValidObjectId(idolId)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const updatedIdol = await Idol.findByIdAndUpdate(
            idolId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedIdol) {
            return res.status(404).json({ message: 'Idol not found' });
        }
        res.status(200).json(updatedIdol);
    } catch (error) {
        res.status(500).json({ message: 'Error updating idol', error });
    }
};

// DELETE Route to delete a single idol by ID
exports.deleteIdolById = async (req, res) => {
    const idolId = req.params.id;

    // Validate ObjectId format
    if (!mongoose.isValidObjectId(idolId)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const deletedIdol = await Idol.findByIdAndDelete(idolId);
        if (!deletedIdol) {
            return res.status(404).json({ message: "Idol not found" });
        }
        res.status(200).json({ message: 'Idol deleted successfully' });
    } catch (error) {
        console.error("Error deleting idol:", error);
        res.status(500).json({ message: 'Error deleting idol', error });
    }
};
