const jwt = require('jsonwebtoken');

Token = require('../model/token.mode')

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const data = await Token.findOne({ value: token });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = decoded;
        if ((decoded.iat * 1000) > Date.now() || data) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        } else {
            return next();
        }
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};