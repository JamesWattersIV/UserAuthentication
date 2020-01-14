const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

//Create the application
const app = express();

//Set up auxiliary components
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

/*--------------------------------- Start of Routes -----------------------------------------------*/
//Import Routes
require('./routes/routes')(app);
require('./routes/user/register')(app);


//Start Server on port 3
app.listen(process.env.PORT || 3000,function(){
    console.log('Server Open');
});
