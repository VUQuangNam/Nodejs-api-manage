module.exports = authorize;
const User = require('../model/user.model')
function authorize(roles) {
    return [
        (req, res, next) => {
            User.findById(req.userData.id, function (error, user) {
                if (error) return res.json({ message: 'Có lỗi xảy ra' });
                if (!user) return res.json({ message: 'Unauthorized' });
                const check = user.role.find(x => x === roles);
                if (!check) return res.status(401).json({ message: 'Bạn không có đủ quyền để thực hiện hành động này' });
                next();
            });

        }
    ];
}