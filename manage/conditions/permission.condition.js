exports.condition = async (req, res, next) => {
    try {
        const params = req.query ? req.query : {};
        const condition = [
            {
                $or: [
                    { name: params.keyword ? new RegExp(params.keyword, 'i') : { $exists: true } },
                    { _id: params.keyword ? new RegExp(params.keyword, 'i') : { $exists: true } }
                ]
            },
            {
                create_at: params.start_time && params.end_time
                    ? {
                        $gte: params.start_time,
                        $lte: params.end_time
                    }
                    : { $exists: true }
            }
        ];
        req.conditions = condition;
        return next();
    } catch (error) {
        return res.json({ message: error })
    }
}