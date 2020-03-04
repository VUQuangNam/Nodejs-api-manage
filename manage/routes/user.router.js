const router = require('express').Router();
const validate = require('express-validation');

const checkAuth = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

const userCondition = require('../condition/user.condition');

const { UserValidation, ListUserValidation } = require('../validate/user.validate');
const userController = require('../controller/user.controller');

router.route('/users')
    .get(checkAuth,
        validate(ListUserValidation),
        checkRole('listUser'),
        userCondition.condition,
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

// Export API routes
module.exports = router;