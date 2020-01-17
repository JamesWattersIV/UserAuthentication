require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

//Create Google and Facebook Authentication Strategies
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook');
const findOrCreate = require('mongoose-findorcreate');

//Create the application
const app = express();

app.use(session({
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));

//Set the app to use passport
app.use(passport.initialize());
app.use(passport.session());

//Connect to Mongoose DB
mongoose.connect(process.env.DB_CONNECT,
    {useNewUrlParser:true,
    useUnifiedTopology: true},
    () => console.log('Connected To MongoDB')
    );

mongoose.set('useCreateIndex',true);

//Create the User Profile Schema
const userSchema = new mongoose.Schema({
    email:String,
    password:String,
    googleId: String,
    facebookId: String,
    fName:String,
    lName:String,
    Age:Number,
    degree:String,
    favCourse:String
});

//Add Schema Plugins
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//Create the new Model
const User = new mongoose.model("User",userSchema);
passport.use(User.createStrategy());

//Serialize and Deserialize User
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

//Authentication Using Google
passport.use(new GoogleStrategy({
        clientID: process.env.G_CLIENT_ID,
        clientSecret: process.env.G_CLIENT_SECRET,
        callbackURL: "https://fast-brook-96655.herokuapp.com/auth/google/profile",
        userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

//Authentication Using Facebook
passport.use(new FacebookStrategy({
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_SECRET,
        callbackURL: "https://fast-brook-96655.herokuapp.com/auth/facebook/profile"
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));


/*--------------------------------- Start of Routes -----------------------------------------------*/
//Set up auxiliary components
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

//Import Routes
require('./routes/routes')(app);
require('./routes/user/register')(app);
require('./routes/user/login')(app);

/*-------------------------------------- 3rd Party (Google and Facebook) AuthO -------------------------*/

//Google Authentication Routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/profile',
    passport.authenticate('google', { failureRedirect: '/login/failed' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/profile');
    });

app.get('/auth/facebook',
    passport.authenticate('facebook',{ scope: ['email'] })
);

app.get('/auth/facebook/profile',
    passport.authenticate('facebook', { failureRedirect: '/login/failed' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/profile');
    });

//Check to see if User is Authenticated
app.get('/profile', function(req,res){
    if(req.isAuthenticated()){
        User.findOne({_id:req.user._id}, function(err,foundUser) {
            if (err) {
                console.log(err, "No User Found");
                res.redirect('/login');
            } else {
                res.render('profile',{fName:foundUser.fName,lName:foundUser.lName,Age:foundUser.Age,Degree:foundUser.degree,favCourse:foundUser.favCourse});
            }
        })
    } else {
        res.redirect('/login');
    }
});

//Logout User and Deauthenticate
app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/')
});

/*--------------------------------------Authentication Using Passport and Hashing -------------------------*/
//Authentication for Email Registration
app.post('/register',function(req,res){
    User.register({username:req.body.username},req.body.password, function(err,user){
        if(err){
            console.log(err);
            res.redirect('/register');
        } else {
            passport.authenticate('local')(req,res,function(){
                res.redirect('/profile');
            });
        }
    });
});

//Authentication for Email Login
app.post('/login',function(req,res){

    const user = new User({
        username: req.body.username,
        password:req.body.password
    });

    req.login(user,function(err){
        if(err){
            console.log(err);
        } else {
            passport.authenticate('local',{ failureRedirect:'/login/failed' })(req,res,function(){
                res.redirect('/profile');
            });
        }
    })
});

app.get('/login/failed',function (req,res) {
    console.log('Here');
    res.redirect('/login');
});

//Update Users Information
app.post('/edit',function(req,res) {
    const userID = req.user.id;
    const fName = req.body.first_name;
    const lName = req.body.last_name;
    const Age = parseInt(req.body.Age, 10);
    const degree = req.body.degree;
    const favCourse = req.body.faveCourse;

    User.updateOne(
        {_id:userID}, //The record we are looking for
        {fName:fName,lName:lName,Age:Age,degree:degree,favCourse:favCourse}, //Fields to update
        function(err){
            if(err){
                console.log(err,"could not update");
            } else {
                console.log("Successful Update");
            }
        }
    );

    res.redirect('/profile');

});

//Start Server on port 3
app.listen(process.env.PORT || 3000,function(){
    console.log('Server Open');
});
