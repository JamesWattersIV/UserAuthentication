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
mongoose.connect("mongodb://localhost:27017/userDB",{
    useNewUrlParser:true,
    useUnifiedTopology: true
});

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
        callbackURL: "http://localhost:3000/auth/google/profile",
        userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

//Authentication Using Facebook
passport.use(new FacebookStrategy({
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/profile"
    },
    function(accessToken, refreshToken, profile, cb) {
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
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/profile');
    });

app.get('/auth/facebook',
    passport.authenticate('facebook',{ scope: ['email'] })
);

app.get('/auth/facebook/profile',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/profile');
    });

//Check to see if User is Authenticated
const check = require('./routes/user/checkUser');

app.get('/profile', function(req,res){
    if(req.isAuthenticated()){
        //check.isFirstLogin(User,req.user._id);
        User.findOne({_id:req.user._id}, function(err,foundUser) {
            if (err) {
                console.log(err, "No User Found");
                res.redirect('/login');
            } else {
                res.render('profile',{fName:foundUser.fName,lName:foundUser.lName,Age:foundUser.Age,Degree:foundUser.degree,favCourse:foundUser.favCourse});
            }
        });

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
    res.redirect('/login');
});

//Start Server on port 3
app.listen(process.env.PORT || 3000,function(){
    console.log('Server Open');
});
