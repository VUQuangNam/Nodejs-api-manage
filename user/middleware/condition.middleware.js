
exports.condition = async (req, res, next) => {
    try {
        const params = req.query ? req.query : {};
        const condition = [
            {
                $or: [
                    { name: params.keyword ? new RegExp(params.keyword, 'i') : { $exists: true } },
                    { _id: params.keyword ? new RegExp(params.keyword, 'i') : { $exists: true } }
                ]
            }
        ];
        req.conditions = condition;
        return next();
    } catch (error) {
        console.log(error);
    }
}

exports.filter = async (req, res, next) => {
    try {
        const params = req.query ? req.query : {};
        const condition = [
            { gender: params.gender ? new RegExp(params.gender, 'i') : { $exists: true } }
        ];
        req.conditions = condition;
        return next();
    } catch (error) {

    }
}
