const router = require('express').Router();
const validate = require('express-validation');

const checkAuth = require('../utilities/CheckAuth');
const permissionCondition = require('../conditions/permission.condition');
const { PermissionValidation, ListPermissionsValidation } = require('../validate/permission.validate')
const perController = require('../controllers/permission.controller');

router.route('/permissions')
    .get(checkAuth,
        validate(ListPermissionsValidation),
        permissionCondition.condition,
        perController.list
    )
    .post(checkAuth,
        validate(PermissionValidation),
        perController.create);
router.route('/permissions/:permission_id')
    .get(checkAuth,
        perController.detail)
    .put(checkAuth,
        validate(PermissionValidation),
        perController.update)
    .delete(checkAuth,
        perController.delete);

module.exports = router;