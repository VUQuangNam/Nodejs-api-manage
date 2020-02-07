const joi = require('joi');

module.exports = {
    ProductValidation: {
        body: {
            name: joi.string().required(),
            description: joi.string(),
            unit: joi.string().only('Cái', 'Chiếc', 'Bộ', 'Đôi'),
            price: joi.number().positive()
        }
    }
}