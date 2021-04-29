module.exports = {
    admin: (req, res, next) => {
        if(req.isAuthenticated() && req.user.admin == 1){
            return next();
        }
        req.flash("error_msg", "You must be authenticated with access adm");
        res.redirect("/")
    }
}