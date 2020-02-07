const joi = require('joi');

module.exports = {
    PermissionValidation: {
        body: {
            name: joi.string().required()
        }
    }
}