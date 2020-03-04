exports.condition = async (req, res, next) => {
    try {
        const params = req.query ? req.query : {};
        let start;
        let end;
        if (params.start_time && params.end_time) {
            start = new Date(params.start_time), end = new Date(params.end_time);
            start.setHours(0, 0, 0, 0); end.setHours(23, 59, 59, 999);
        }
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
                        $between: [start, end]
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