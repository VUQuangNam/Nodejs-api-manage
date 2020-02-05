var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')
// Import  model
User = require('../model/user.model');

// Handle index actions
exports.list = function (req, res) {
    User.get(function (error, users) {
        if (error) {
            res.json({
                status: "error",
                message: error,
            });
        }
        res.json({
            status: "success",
            message: "Danh sách liên hệ",
            data: users
        });
    });
};

exports.create = (req, res) => {
    var user = new User(req.body);
    user.save(async (error, user) => {
        if (error) {
            res.json(
                {
                    code: false,
                    message: 'Tạo mới thất bại'
                }
            );
            return;
        } else {
            res.json({
                message: 'Thêm mới thành công!',
                data: user
            });
        }
    });
};

exports.detail = function (req, res) {
    User.findById(req.params.user_id, function (error, user) {
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
        await User.findByIdAndUpdate(req.params.user_id, req.body)
        return res.json({ message: 'Cập nhật dữ liệu thành công!' })
    } catch (erroror) {
        return handlePageerroror(res, erroror)
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
                    res.json({
                        "login": "success",
                        user: user,
                        token: jwt.sign({ id: user._id, username: user.username, name: user.name }, 'VQN')
                    })
                } else {
                    return res.json({ error: 'Tên đăng nhập và mật khẩu không chính xác' })
                }
            })
        })
}