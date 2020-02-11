var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Setup schema
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
        role: [String],
        email: {
            type: String,
            required: true
        },
        age: Number,
        gender: String,
        phone: String,
        address: {
            type: String,
            default: null
        },
        birthday: Date,
        update_at: {
            type: Number,
            default: Date.now
        },
        create_at: {
            type: Number,
            default: Date.now
        }
    }
);

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (username, password) => {
    // Search for a user by username and password.
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

// Export User model
var User = module.exports = mongoose.model('User', userSchema, 'users');
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}