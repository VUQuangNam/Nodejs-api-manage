const joi = require('joi')

module.exports = {
    UserValidation: {
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
    },
    ListUserValidation: {
        query: {
            skip: joi.number()
                .min(0)
                .default(0),
            limit: joi.number()
                .default(10),
            gender: joi.array()
                .items(joi.string())
                .allow(null, ''),
            keyword: joi.string()
                .allow(null, ''),
        }
    }
}