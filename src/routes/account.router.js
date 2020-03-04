const router = require('express').Router();

const checkAuth = require('../utilities/CheckAuth');
const accountController = require('../controllers/account.controller')

router.post('/login', accountController.login);

router.post('/logout', accountController.logout);

router.post('/changePas', checkAuth,
    accountController.changePass
)

module.exports = router;