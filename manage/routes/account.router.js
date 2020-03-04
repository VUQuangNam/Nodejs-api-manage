const router = require('express').Router();

const checkAuth = require('../middleware/auth.middleware');
const accountController = require('../controller/account.controller')

router.route('/login').post(accountController.login);

router.route('/logout').post(accountController.logout);

router.route('/changePas')
    .post(checkAuth,
        accountController.changePass
    )

module.exports = router;