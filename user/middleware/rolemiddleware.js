module.exports = authorize;

function authorize(roles) {
    return [
        (req, res, next) => {
            const check = req.userData.role.find(x => x === roles);
            if (!check) {
                return res.status(401).json({ message: 'Bạn không có đủ quyền để thực hiện hành động này' });
            }
            next();
        }
    ];
}