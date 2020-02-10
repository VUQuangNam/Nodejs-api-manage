const joi = require('joi');

module.exports = {
    ProductValidation: {
        body: {
            name: joi.string().required(),
            description: joi.string(),
            unit: joi.string().only('Cái', 'Chiếc', 'Bộ', 'Đôi'),
            price: joi.number().positive()
        }
    },

    ListProductsValidation: {
        query: {
            skip: joi.number()
                .min(0)
                .default(0),
            limit: joi.number()
                .default(10),
            unit: joi.array()
                .items(joi.string())
                .allow(null, ''),
            keyword: joi.string()
                .allow(null, ''),
            min_price: joi.number().allow(null, '').min(0),
            max_price: joi.number().allow(null, ''),
            start_time: joi.date().allow(null, ''),
            end_time: joi.date().allow(null, '')
        }
    }
}