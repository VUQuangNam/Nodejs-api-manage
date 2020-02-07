const mongoose = require('mongoose')

// Import  model
Products = require('../model/product.model');

// Handle index actions
exports.list = function (req, res) {
    console.log(req);
    Products.get(function (error, Products) {
        if (error) {
            res.json({
                status: "error",
                message: error,
            });
        }
        res.json({
            status: "success",
            message: "Danh sách sản phẩm",
            data: Products
        });
    });
};

exports.create = (req, res) => {
    const { name, description, unit, price } = req.body;
    var product = new Products({
        _id: mongoose.Types.ObjectId(),
        name,
        description,
        unit,
        price,
        create_by: {
            id: req.userData.id,
            name: req.userData.name
        }
    });
    product.save(async (error, product) => {
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
                data: product
            });
        }
    });
};

exports.detail = function (req, res) {
    Products.findById(req.params.product_id, function (error, product) {
        if (error)
            res.send(error);
        res.json({
            data: product
        });
    });
};

// Handle update product info
exports.update = async (req, res) => {
    try {
        await Products.findByIdAndUpdate(
            req.params.product_id,
            req.body
        )
        return res.json({
            message: 'Cập nhật dữ liệu thành công!'
        })
    } catch (err) {
        return handlePageerroror(res, err)
    }
};

// Handle delete product
exports.delete = function (req, res) {
    Products.remove({
        _id: req.params.product_id
    }, function (error) {
        if (error)
            res.send(error);
        res.json({
            status: "success",
            message: 'Xóa Thành Công'
        });
    });
};
