module.exports = authorize;

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        (req, res, next) => {
            if (roles.length && !roles.includes(req.userData.role)) {
                return res.status(401).json({ message: 'Bạn không có đủ quyền để thực hiện hành động này' });
            }
            next();
        }
    ];
}