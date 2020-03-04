const router = require('express').Router();
const validate = require('express-validation');

const checkAuth = require('../utilities/CheckAuth');
const checkRole = require('../utilities/CheckRole');

const userCondition = require('../conditions/user.condition');

const { UserValidation, ListUserValidation } = require('../validate/user.validate');
const userController = require('../controllers/user.controller');

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

module.exports = router;