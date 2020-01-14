/* @description:: module to handle the register requests for a user */

module.exports = function(app){

    app.get('/register', function(req, res){
        res.render('register');
    });

};