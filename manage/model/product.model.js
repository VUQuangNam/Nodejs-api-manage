var mongoose = require('mongoose');

var productSchema = mongoose.Schema(
    {
        _id: {
            type: String
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        unit: {
            type: String
        },
        price: {
            type: Number
        },
        create_at: {
            type: Number,
            default: Date.now
        },
        update_at: {
            type: Number,
            default: Date.now
        },
        create_by: {
            id: String,
            name: String
        }

    }
);

// Export Product model
var Product = module.exports = mongoose.model('Product', productSchema, 'products');
module.exports.get = function (callback, limit) {
    Product.find(callback).limit(limit);
}

Product.findOneProduct = async (id) => {
    try {
        const data = await Product.findOne({ _id: id });
        if (data) return {
            status: 200,
            data: data
        }
        return {
            status: 404,
            message: 'NOT_FOUND'
        }
    } catch (error) {
        console.log(error);
    }
}