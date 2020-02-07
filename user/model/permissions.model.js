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
        }
    }
);

// Export Permission model
var Permission = module.exports = mongoose.model('Permission', permissionSchema, 'permissions');
module.exports.get = function (callback, limit) {
    Permission.find(callback).limit(limit);
}