const joi = require('joi');

module.exports = {
    ProductValidation: {
        body: {
            name: joi.string().required().alphanum(),
            description: joi.string().alphanum(),
            unit: joi.string().only('Cái', 'Chiếc', 'Bộ', 'Đôi'),
            price: joi.number().positive()
        }

    }
}