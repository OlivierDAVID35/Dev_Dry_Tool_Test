const express = require('express');
const router = express.Router();

const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true }) 

const authController = require('../controllers/authController');
const adminCheck = require('../middelwares/adminCheck');

router.get('/profil', csrfProtection, authController.profil);
router.get('/logout', authController.logout);
router.get('/admin', csrfProtection, adminCheck, authController.adminPage);

router.use((req, res) => {
    res.status(404).render('404');
});

module.exports = router;