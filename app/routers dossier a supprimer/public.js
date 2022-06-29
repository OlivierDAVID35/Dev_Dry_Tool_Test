const express = require('express');
const router = express.Router();

const mainController = require('../controllers/mainController');
const authController = require('../controllers/authController');
const loginCheck = require('../middelwares/loginCheck');

router.get('/', mainController.homePage);

router.get('/signup', loginCheck, authController.signupPage);
router.post('/signup', authController.signup);

router.get('/login', loginCheck, authController.loginPage);
router.post('/login', authController.login);

router.use((req, res) => {
    res.status(404).render('404');
});

module.exports = router;