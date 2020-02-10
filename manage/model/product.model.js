var mongoose = require('mongoose');

// Setup schema
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
            type: Date,
            default: Date.now
        },
        update_at: {
            type: Date,
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