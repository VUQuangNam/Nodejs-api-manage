const router = require('express').Router();
const validate = require('express-validation');

const checkAuth = require('../middleware/auth.middleware');

const productCondition = require('../condition/product.condition');
const { ProductValidation, ListProductsValidation } = require('../validate/product.validate');
const productController = require('../controller/product.controller');

router.route('/products')
    .get(checkAuth,
        validate(ListProductsValidation),
        productCondition.condition,
        productController.list
    )
    .post(checkAuth,
        validate(ProductValidation),
        productController.create);
router.route('/products/:product_id')
    .get(checkAuth,
        productController.detail)
    .put(checkAuth,
        validate(ProductValidation),
        productController.update)
    .delete(checkAuth,
        productController.delete);

module.exports = router;