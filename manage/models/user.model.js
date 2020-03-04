var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var userSchema = mongoose.Schema(
    {
        _id: {
            type: String
        },
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: Array,
            default: []
        },
        email: {
            type: String,
            required: true
        },
        age: Number,
        gender: {
            type: String,
            default: 'male'
        },
        phone: {
            type: String,
            default: '0987654321'
        },
        address: {
            type: String,
            default: null
        },
        birthday: {
            type: Date,
            default: null
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

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username })
    if (!user) {
        throw new Error({ error: 'Thông tin đăng nhập không hợp lệ' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Thông tin đăng nhập không hợp lệ' })
    }
    return user
}

var User = module.exports = mongoose.model('User', userSchema, 'users');
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}

User.findOneUser = async (id) => {
    try {
        const data = await User.findOne({ _id: id });
        if (data) return {
            status: 200,
            data: data
        }
        return {
            status: 404,
            message: 'NOT_FOUND'
        }
    } catch (error) {
        console.log(error);
    }
}