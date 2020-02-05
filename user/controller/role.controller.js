// Import  model
Role = require('../model/role.model');

// Handle index actions
exports.list = function (req, res) {
    Role.get(function (error, roles) {
        if (error) {
            res.json({
                status: "error",
                message: error,
            });
        }
        res.json({
            status: "success",
            message: "Danh sách ",
            data: roles
        });
    });
};