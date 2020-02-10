exports.condition = async (req, res, next) => {
    try {
        const params = req.query ? req.query : {};
        const condition = [
            {
                unit: params.unit
                    ? { $in: params.unit }
                    : { $exists: true }
            },
            {
                $or: [
                    { name: params.keyword ? new RegExp(params.keyword, 'i') : { $exists: true } },
                    { _id: params.keyword ? new RegExp(params.keyword, 'i') : { $exists: true } }
                ]
            },
            {
                price: params.min_price && params.max_price
                    ? { $gte: params.min_price, $lte: params.max_price }
                    : { $exists: true }
            },
            {
                create_at: params.stat_time && params.end_time
                    ? {
                        $gte: new Date(new Date(start_time).setHours(00, 00, 00)),
                        $lt: new Date(new Date(end_time).setHours(23, 59, 59))
                    }
                    : { $exists: true }
            }
        ];
        req.conditions = condition;
        return next();
    } catch (error) {
        console.log(error);
    }
}