const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    var roleController = require('../controller/role.controller');
    console.log(roleController.list);
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'VQN');
        req.userData = decoded;
        console.log(decoded.role);
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};