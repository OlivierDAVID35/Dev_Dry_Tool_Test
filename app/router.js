const express = require('express');
const router = express.Router();

const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true }) 

const mainController = require('./controllers/mainController');
const authController = require('./controllers/authController');
const loginCheck = require('./middelwares/loginCheck');
const adminCheck = require('./middelwares/adminCheck');

router.get('/', mainController.homePage);

router.get('/signup', csrfProtection, loginCheck, authController.signupPage);
router.post('/signup', csrfProtection, authController.signup);

router.get('/login', csrfProtection, loginCheck, authController.loginPage);
router.post('/login', csrfProtection, authController.login);

router.get('/profil', authController.profil);

router.get('/logout', authController.logout);

router.get('/admin', adminCheck, authController.adminPage);

router.use((req, res) => {
    res.status(404).render('404');
});

module.exports = router;