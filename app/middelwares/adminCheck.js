function adminCheck(req, res, next) {
    // si le user n'est pas admin alors on l'envoie sur la page d'accueil
    if(!req.session.user || req.session.user.role !== 'admin') return res.redirect('/');
    // if(req.session.user && req.session.user.role === 'admin') return next();
    next();
}

module.exports = adminCheck;