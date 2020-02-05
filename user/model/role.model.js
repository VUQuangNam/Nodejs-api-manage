var mongoose = require('mongoose');

// Setup schema
var roleSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        create: {
            type: number,
            required: true
        },
        list: {
            type: number,
            required: true
        },
        update: {
            type: number,
            required: true
        },
        detail: {
            type: number,
            required: true
        },
        delete: {
            type: number,
            required: true
        }
    }
);

// Export role model
var Role = module.exports = mongoose.model('Role', roleSchema, 'role');
module.exports.get = function (callback, limit) {
    Role.find(callback).limit(limit);
}