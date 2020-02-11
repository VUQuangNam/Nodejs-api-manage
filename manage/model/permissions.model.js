var mongoose = require('mongoose');

// Setup schema
var permissionSchema = mongoose.Schema(
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

// Export Permission model
var Permission = module.exports = mongoose.model('Permission', permissionSchema, 'permissions');
module.exports.get = function (callback, limit) {
    Permission.find(callback).limit(limit);
}