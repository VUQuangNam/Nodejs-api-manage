const router = require('express').Router();
const validate = require('express-validation');

const checkAuth = require('../middleware/AuthMiddleware');
const checkRole = require('../middleware/rolemiddleware');

const { UserValidation } = require('../validate/user.validate');
const { ProductValidation } = require('../validate/product.validate');

var userController = require('../controller/user.controller');
var perController = require('../controller/permission.controller');
var productController = require('../controller/product.controller');

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API',
        message: 'api-router'
    });
});

// user routes
router.route('/users')
    .get(checkAuth,
        checkRole('listUser'),
        userController.list
    )
    .post(checkAuth,
        checkRole('createUser'),
        validate(UserValidation),
        userController.create);
router.route('/users/:user_id')
    .get(checkAuth,
        checkRole('detailUser'),
        userController.detail)
    .put(checkAuth,
        checkRole('updateUser'),
        validate(UserValidation),
        userController.update)
    .delete(checkAuth,
        checkRole('deleteUser'),
        userController.delete);

// permission router
router.route('/permissions')
    .get(checkAuth,
        perController.list
    )
    .post(checkAuth,
        // validate(Validation),
        perController.create);
router.route('/permissions/:permission_id')
    .get(checkAuth,
        perController.detail)
    .put(checkAuth,
        // validate(Validation),
        perController.update)
    .delete(checkAuth,
        perController.delete);

// router product
router.route('/products')
    .get(checkAuth,
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

router.route('/login').post(userController.login);

// Export API routes
module.exports = router;