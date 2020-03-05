const mongoose = require('mongoose')

User = require('../models/user.model');
Token = require('../models/token.mode')

const sendEmail = require('../utilities/sendEmail');

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
        users.forEach(x => {
            delete x.password;
            delete x.__v;
        });
        return res.json({
            count: users.length,
            data: users
        });
    } catch (error) {
        return res.json({ message: error })
    }
};

exports.create = async (req, res) => {
    try {
        const { name, username, password, role, email, age, gender, phone, address, birthday } = req.body;
        const user = new User({
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
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email }
            ]
        });
        if (data) {
            return res.json({ message: 'Tên đăng nhập hoặc email đã được sử dụng' })
        } else {
            user.save(async (error, user) => {
                user = user.toJSON();
                delete user.password;
                delete user.__v;
                if (error) {
                    return res.json({ message: 'Tạo mới thất bại' });
                } else {
                    // send email
                    if (user.email) {
                        sendEmail({
                            to: user.email,
                            subject: 'Thêm mới nhân viên thành công'
                        })
                    }
                    return res.json({
                        message: 'Thêm mới thành công!',
                        data: user
                    });
                }
            });
        }
    } catch (error) {
        return res.json({ message: error })
    }
};

exports.detail = async (req, res) => {
    try {
        let data = await User.findOneUser(req.params.user_id);
        if (data.status === 200) return res.json({ data: data.data })
        if (!data.data) return res.json({ message: 'Không tìm thấy dữ liệu' })
    } catch (error) {
        return res.json({ message: 'Không tìm thấy dữ liệu' })
    }
};

exports.update = async (req, res) => {
    try {
        const { user_id } = req.params;
        const body = req.body;
        if (body.password) return res.json({ message: 'Không thể đổi mật khẩu trong mục này' })
        body.update_at = Date.now();
        let data = await User.findOneUser(user_id);
        if (data.status === 200) {
            await User.updateOne({ _id: user_id }, body);
            return res.json({ message: 'Cập nhật dữ liệu thành công' });
        }
        if (!data.data) return res.json({ message: 'Không tìm thấy dữ liệu' })
    } catch (err) {
        return res.json({ message: err })
    }
};

exports.delete = async (req, res) => {
    try {
        let data = await User.findOneUser(req.params.user_id);
        if (data.status === 200) {
            await User.deleteOne({ _id: data.data._id });
            return res.json({ message: 'Xóa Thành Công' });
        }
        if (!data.data) return res.json({ message: 'Không tìm thấy dữ liệu' })
    } catch (error) {
        return res.json({ message: error })
    }
};