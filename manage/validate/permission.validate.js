const joi = require('joi');

module.exports = {
    PermissionValidation: {
        body: {
            name: joi.string().required()
        }
    },
    ListPermissionsValidation: {
        query: {
            skip: joi.number()
                .min(0)
                .default(0),
            limit: joi.number()
                .default(10),
            keyword: joi.string()
                .allow(null, ''),
            start_time: joi.number().allow(null, ''),
            end_time: joi.number().allow(null, '')
        }
    }
}