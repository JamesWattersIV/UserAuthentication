module.exports = function(app){

    app.get('/auth', function(req, res){
        res.send('<h1> User Authentication Route </h1>');
    });

    //other routes..
};