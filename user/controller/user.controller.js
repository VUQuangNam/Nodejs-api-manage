var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

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
        const { user_id } = req.params;
        const body = req.body;
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
        return handlePageerroror(res, err)
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
                        message: "Đăng nhập thành công",
                        user: user,
                        token: jwt.sign({ id: user._id, username: user.username, name: user.name, role: user.role }, process.env.JWT_SECRET)
                    })
                } else {
                    return res.json({ error: 'Tên đăng nhập và mật khẩu không chính xác' })
                }
            })
        })
}

exports.logout = () => { }
