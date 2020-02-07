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
        }

    }
);

// Export Product model
var Product = module.exports = mongoose.model('Product', productSchema, 'products');
module.exports.get = function (callback, limit) {
    Product.find(callback).limit(limit);
}