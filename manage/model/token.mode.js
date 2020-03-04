var mongoose = require('mongoose');

var TokenSchema = mongoose.Schema(
    {
        _id: {
            type: String
        },
        value: {
            type: String
        },
        is_exist: {
            type: Boolean
        }
    }
);

// Export Token model
var Token = module.exports = mongoose.model('Token', TokenSchema, 'token');
module.exports.get = function (callback, limit) {
    Token.find(callback).limit(limit);
}