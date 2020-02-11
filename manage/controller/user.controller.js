var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

// Import  model
User = require('../model/user.model');
Token = require('../model/token.mode')

// Handle index actions
exports.list = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $match: {
                    $and: req.conditions
                }
            },
            {
                $skip: req.query.skip
            },
            {
                $limit: req.query.limit
            }
        ]);
        return res.json({
            message: 'Danh sách tài khoản',
            users
        });
    } catch (error) {
        console.log("List users error: " + error);
    }
};

exports.create = async (req, res) => {
    const { name, username, password, role, email, age, gender, phone, address, birthday } = req.body;
    var user = new User({
        _id: mongoose.Types.ObjectId(),
        name,
        username,
        password,
        role,
        email,
        age,
        gender,
        phone,
        address,
        birthday,
        create_by: {
            id: req.userData.id,
            name: req.userData.name
        }
    });
    let data = await User.findOne({ username: req.body.username });
    if (data) {
        return res.json({ message: 'Tên đăng nhập đã tồn tại' })
    } else {
        user.save(async (error, user) => {
            user = user.toJSON();
            delete user.password;
            delete user.__v;
            if (error) {
                return res.json({ message: 'Tạo mới thất bại' });
            } else {
                res.json({
                    message: 'Thêm mới thành công!',
                    data: user
                });
            }
        });
    }
};

exports.detail = function (req, res) {
    User.findById(req.params.user_id, function (error, user) {
        user = user.toJSON();
        delete user.password;
        delete user.__v;
        if (error)
            res.send(error);
        res.json({
            data: user
        });
    });
};

// Handle update user info
exports.update = async (req, res) => {
    try {
        const { user_id } = req.params;
        const body = req.body;
        if (body.password) return res.json({ message: 'Không thể đổi mật khẩu trong mục này' })
        body.update_at = Date.now();
        let data = await User.findOne({ _id: user_id });
        if (data) {
            respont = await User.updateOne(
                { _id: user_id }, body
            );
            if (!respont) return res.json({
                message: 'Không tìm thấy tài khoản được update'
            });
            if (respont.nModified === 0) return res.json({
                message: 'Dữ liệu không có gì thay đổi'
            });
            return res.json({
                message: 'Cập nhật dữ liệu thành công'
            });
        } else {
            return res.json({ message: 'ID không đúng' });
        }
    } catch (err) {
        return handlePageerror(res, err)
    }
};

// Handle delete user
exports.delete = function (req, res) {
    User.remove({
        _id: req.params.user_id
    }, function (error) {
        if (error)
            res.send(error);
        res.json({
            status: "success",
            message: 'Xóa Thành Công'
        });
    });
};

exports.login = async (req, res) => {
    User.findOne(
        { username: req.body.username }).exec(function (error, user) {
            if (error) {
                return res.json({ error })
            } else if (!user) {
                return res.json({ error: 'Tên đăng nhập và mật khẩu không chính xác' })
            }
            bcrypt.compare(req.body.password, user.password, (error, result) => {
                if (result === true) {
                    user = user.toJSON();
                    delete user.password;
                    res.json({
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
                    return res.json({ error: 'Tên đăng nhập và mật khẩu không chính xác' })
                }
            })
        })
}

exports.logout = (req, res) => {
    var token = new Token({
        _id: mongoose.Types.ObjectId(),
        value: req.headers.authorization.split(" ")[1],
        is_exist: false
    });
    token.save();
    return res.json({ message: 'Đăng xuất thành công' })
}

exports.changePass = async (req, res) => {
    User.findOne(
        { username: req.userData.username }).exec(function (error, user) {
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
                    respont = await User.updateOne(
                        { _id: user._id }, body
                    );
                    if (respont) return res.json({
                        message: 'Cập nhật mật khẩu thành công'
                    });
                } else {
                    return res.json({ error: 'Mật khẩu cũ không đúng.' })
                }
            })
        })
};
