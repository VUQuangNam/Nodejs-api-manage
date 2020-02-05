let router = require('express').Router();
const checkAuth = require('./AuthMiddleware')
const { Validation } = require('../validate/validate')
const validate = require('express-validation')

const checkRole = require('../permission/permission')

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
    .get(checkAuth, userController.list)
    .post(checkAuth, validate(Validation), userController.create);
router.route('/users/:user_id')
    .get(checkAuth, userController.detail)
    .put(checkAuth, validate(Validation), userController.update)
    .delete(checkAuth, userController.delete);
router.route('/login').post(userController.login);
// Export API routes
module.exports = router;