const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

const User = require('../models/user.model');
const Token = require('../models/token.mode')

exports.login = async (req, res) => {
    try {
        User.findOne(
            { username: req.body.username }).exec((error, user) => {
                if (error) {
                    return res.json({ message: error })
                } else if (!user) {
                    return res.json({ message: 'Tên đăng nhập và mật khẩu không chính xác' })
                }
                bcrypt.compare(req.body.password, user.password, (error, result) => {
                    if (error) return res.json({ message: error });
                    if (result === true) {
                        user = user.toJSON();
                        delete user.password;
                        delete user.__v;
                        return res.json({
                            message: "Đăng nhập thành công",
                            data: user,
                            token: jwt.sign({
                                id: user._id, username: user.username,
                                name: user.name, role: user.role
                            },
                                process.env.JWT_SECRET,
                                { expiresIn: '1d' })
                        })
                    } else {
                        return res.json({ message: 'Tên đăng nhập và mật khẩu không chính xác' })
                    }
                })
            })
    } catch (error) {
        return res.json({ message: error })
    }
}

exports.logout = (req, res) => {
    try {
        const token = new Token({
            _id: mongoose.Types.ObjectId(),
            value: req.headers.authorization.split(" ")[1],
            is_exist: false
        });
        token.save();
        return res.json({ message: 'Đăng xuất thành công' })
    } catch (error) {
        return res.json({ message: error })
    }
}

exports.changePass = async (req, res) => {
    try {
        User.findOne(
            { username: req.userData.username }).exec((error, user) => {
                if (error) {
                    return res.json({ error })
                } else if (!user) {
                    return res.json({ error: 'Unauthorized' })
                }
                bcrypt.compare(req.body.password_old, user.password, async (error, result) => {
                    if (result === true) {
                        const body = req.body;
                        body.password = await bcrypt.hash(req.body.password_new, 8)
                        delete body.password_new;
                        delete body.password_old;
                        await User.updateOne({ _id: user._id }, body);
                        return res.json({
                            message: 'Cập nhật mật khẩu thành công'
                        });
                    } else {
                        return res.json({ error: 'Mật khẩu cũ không đúng.' })
                    }
                })
            })
    } catch (error) {
        return res.json({ message: error })
    }
};