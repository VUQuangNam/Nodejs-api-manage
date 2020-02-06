let router = require('express').Router();
const checkAuth = require('../middleware/AuthMiddleware');
const { Validation } = require('../validate/validate');
const validate = require('express-validation');
const checkRole = require('../middleware/rolemiddleware');

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API',
        message: 'api-router'
    });
});

var userController = require('../controller/user.controller');

// user routes
router.route('/users')
    .get(checkAuth,
        checkRole('listUser'),
        userController.list
    )
    .post(checkAuth,
        checkRole('createUser'),
        validate(Validation),
        userController.create);
router.route('/users/:user_id')
    .get(checkAuth,
        checkRole('detailUser'),
        userController.detail)
    .put(checkAuth,
        checkRole('updateUser'),
        validate(Validation),
        userController.update)
    .delete(checkAuth,
        checkRole('deleteUser'),
        userController.delete);
router.route('/login').post(userController.login);
// Export API routes
module.exports = router;