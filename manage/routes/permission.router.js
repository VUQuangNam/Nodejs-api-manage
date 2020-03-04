const router = require('express').Router();
const validate = require('express-validation');

const checkAuth = require('../middleware/auth.middleware');
const permissionCondition = require('../condition/permission.condition');
const { PermissionValidation, ListPermissionsValidation } = require('../validate/permission.validate')
var perController = require('../controller/permission.controller');

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