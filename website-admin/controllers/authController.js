const Admin = require('../models/admin');

exports.authenticateAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (admin) {
            if (admin.password === password) {
                return res.json("exist");
            } else {
                return res.json("wrong password");
            }
        } else {
            return res.json("notexist");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("notexist");
    }
};
