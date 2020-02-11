mongoose = require('mongoose');

// Import  model
Permissions = require('../model/permissions.model');

// Handle index actions
exports.list = async (req, res) => {
    try {
        const permissions = await Permissions.aggregate([
            {
                $match: {
                    $and: req.conditions
                }
            }
        ]);
        return res.json({
            count: permissions.length,
            message: 'Danh sách quyền',
            permissions
        });
    } catch (error) {
        console.log("List permissions error: " + error);
    }
};

exports.create = async (req, res) => {
    const { name, description } = req.body;
    let data = await Permissions.findOne({ name: req.body.name });
    if (data) {
        return res.json(
            {
                message: 'Quyền đã tồn tại'
            }
        );
    } else {
        var permission = new Permissions({
            _id: mongoose.Types.ObjectId(),
            name,
            description,
            create_by: {
                id: req.userData.id,
                name: req.userData.name
            }
        });
        permission.save(async (error, permission) => {
            if (error) {
                return res.json(
                    {
                        code: false,
                        message: 'Tạo mới thất bại'
                    }
                );
            } else {
                return res.json({
                    message: 'Thêm mới thành công!',
                    data: permission
                });
            }
        });
    }

};

exports.detail = function (req, res) {
    Permissions.findById(req.params.permission_id, function (error, permission) {
        if (error) return res.send(error);
        return res.json({
            data: permission
        });
    });
};

// Handle update permission info
exports.update = async (req, res) => {
    try {
        const { permission_id } = req.params;
        const body = req.body;
        body.update_at = Date.now();
        let data = await Permissions.findOne({ _id: permission_id });
        if (data) {
            respont = await Permissions.updateOne(
                { _id: permission_id }, body
            );
            if (!respont) return res.json({
                message: 'Không tìm thấy quyền được update'
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

// Handle delete permission
exports.delete = function (req, res) {
    Permissions.remove({
        _id: req.params.permission_id
    }, function (error) {
        if (error) return res.send(error);
        return res.json({
            status: "success",
            message: 'Xóa Thành Công'
        });
    });
};
