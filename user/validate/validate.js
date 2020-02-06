const joi = require('joi')

module.exports = {
    Validation: {
        body: {
            name: joi.string(),
            username: joi.string(),
            password: joi.string(),
            address: joi.string(),
            phone: joi.string().length(10),
            gender: joi.string().only('male', 'female'),
            age: joi.number().integer().min(1),
            birthday: joi.date().less('12/30/2020')
        }

    }
}