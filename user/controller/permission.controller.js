// Import  model
Permissions = require('../model/permissions.model');
mongoose = require('mongoose');

// Handle index actions
exports.list = function (req, res) {
    Permissions.get(function (error, permissions) {
        if (error) {
            res.json({
                status: "error",
                message: error,
            });
        }
        res.json({
            status: "success",
            message: "Danh sách",
            data: permissions
        });
    });
};

exports.create = (req, res) => {
    const { name, description } = req.body;
    var permission = new Permissions({
        _id: mongoose.Types.ObjectId(),
        name,
        description
    });
    permission.save(async (error, permission) => {
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
                data: permission
            });
        }
    });
};

exports.detail = function (req, res) {
    Permissions.findById(req.params.permission_id, function (error, permission) {
        if (error)
            res.send(error);
        res.json({
            data: permission
        });
    });
};

// Handle update permission info
exports.update = async (req, res) => {
    try {
        await Permissions.findByIdAndUpdate(
            req.params.permission_id,
            req.body
        )
        return res.json({
            message: 'Cập nhật dữ liệu thành công!'
        })
    } catch (err) {
        return handlePageerroror(res, err)
    }
};

// Handle delete permission
exports.delete = function (req, res) {
    Permissions.remove({
        _id: req.params.permission_id
    }, function (error) {
        if (error)
            res.send(error);
        res.json({
            status: "success",
            message: 'Xóa Thành Công'
        });
    });
};
