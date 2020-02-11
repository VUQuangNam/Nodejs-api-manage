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
                price: params.min_price
                    ? { $gte: params.min_price } : { $exists: true }
            },
            {
                price: params.max_price
                    ? { $lte: params.max_price } : { $exists: true }
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
        console.log(error);
    }
}