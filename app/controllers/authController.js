const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');
const User = require("../models/user");

const authController = {
    signupPage: function(req, res) {
        res.render('signup', { csrfToken: req.csrfToken() });
    },
    loginPage: function(req, res) {
        res.render('login', { csrfToken: req.csrfToken() });
    },
    signup: async function(req, res) {
        const errors = [];
        if(!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password || !req.body.passwordConfirm) {
            errors.push("Vous devez remplir tous les champs");
        }
        if(!emailValidator.validate(req.body.email)) {
            errors.push("L'email n'est pas valide");
        }
        if(req.body.password.length < 8) {
            errors.push("Le mot de passe doit contenir au moins 8 caractères")
        }
        if(req.body.password !== req.body.passwordConfirm) {
            errors.push("Les deux mots de passes ne correspondent pas");
        }

        //? test si l'utilisateur n'existe pas déjà
        const user = await User.findOne({
            where: {
                "email": req.body.email
            }
        });
        //? si il a trouvé le user en base via l'email, alors c'est que l'utilisateur est déjà inscrit !
        if(user) {
            errors.push("Un utilisateur inscrit sur le site possède déjà cette adresse email !");
        }

        if(errors.length > 0) return res.render('signup', {errors});
        delete req.body.passwordConfirm;

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        //? on inscrit l'utilisateur en base
        await User.create(req.body);
        return res.redirect('/login', { csrfToken: req.csrfToken() });
    },

    login: async function(req, res) {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if(!user) return res.redirect('/login');
        const passIsGood = await bcrypt.compare(req.body.password, user.password);
        if(!passIsGood) return res.redirect('/login');
        
        //? Préparation de l'objet et stockage dans la session.
        const userSession = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            fullname: user.fullname,
            email: user.email,
            role: user.role
        }
        //? ici on créé la propriété de session user qui contient les infos du user connecté qui seront plus tard, grâce au res.locals dans index, passés à nos vues
        req.session.user = userSession;
   
        // on le renvoie sur l'accueil
        return res.redirect('/', { csrfToken: req.csrfToken() });

    },
    logout: function(req, res) {
        req.session.destroy();
        return res.redirect('/');
    },
    profil: function(req, res) {
        if(!req.session.user) return res.redirect('/login');
        res.render('profil');
    },
    adminPage: function(req, res) {
        res.render('admin');
    }
}

module.exports = authController;