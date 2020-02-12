const mongoose = require('mongoose')

Products = require('../model/product.model');

exports.list = async (req, res) => {
    try {
        const products = await Products.aggregate([
            {
                $match: {
                    $and: req.conditions
                }
            }
        ]);
        products.forEach(x => { delete x.__v; });
        return res.json({
            count: products.length,
            data: products
        });
    } catch (error) {
        return res.json({ message: error })
    }
};

exports.create = async (req, res) => {
    try {
        const { name, description, unit, price } = req.body;
        let data = await Products.findOne({ name: req.body.name });
        if (data) {
            return res.json({ message: 'Tên sản phẩm đã được sử dụng' });
        } else {
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
                    return res.json({ message: 'Tạo mới thất bại' });
                } else {
                    product = product.toJSON();
                    delete product.__v;
                    return res.json({
                        message: 'Thêm mới thành công!',
                        data: product
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
        const data = await Products.findOneProduct(req.params.product_id);
        if (data.status === 200) return res.json({ data: data.data });
        if (!data.data) return res.json({ message: 'Không tìm thấy dữ liệu' })
    } catch (error) {
        return res.json({ message: error })
    }
};

exports.update = async (req, res) => {
    try {
        const { product_id } = req.params;
        const body = req.body;
        body.update_at = Date.now();
        let data = await Products.findOneProduct(product_id);
        if (data.status === 200) {
            respont = await Products.updateOne(
                { _id: product_id }, body
            );
            return res.json({ message: 'Cập nhật dữ liệu thành công' });
        }
        if (!data.data) return res.json({ message: 'Không tìm thấy dữ liệu' });
    } catch (err) {
        return res.json({ message: error });
    }
};

exports.delete = async (req, res) => {
    try {
        let data = await Products.findOneProduct(req.params.product_id);
        if (data.status === 200) {
            await Products.deleteOne({ _id: data._id });
            return res.json({ message: 'Xóa Thành Công' });
        }
        if (!data.data) return res.json({ message: 'Không tìm thấy dữ liệu' })
    } catch (error) {
        return res.json({ message: error })
    }
};
