var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// require the socket.io module


//var apikey = require('./config/apikey');

// AUTHENTICATION MODULES
session = require("express-session"),
bodyParser = require("body-parser"),
User = require( './models/User' ),
flash = require('connect-flash')
// END OF AUTHENTICATION MODULES

const mongoose = require( 'mongoose' );

mongoose.connect( 'mongodb://localhost/mydb', { useNewUrlParser: true } );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});

const commentController = require('./controllers/commentController')
const profileController = require('./controllers/profileController')
const forumPostController = require('./controllers/forumPostController')

// Authentication
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// here we set up authentication with passport
const passport = require('passport')
const configPassport = require('./config/passport')
configPassport(passport)


var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



/*************************************************************************
     HERE ARE THE AUTHENTICATION ROUTES
**************************************************************************/

app.use(session(
  { secret: 'zzbbyanana',
    resave: false,
    saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));



const approvedLogins = ["tjhickey724@gmail.com","csjbs2018@gmail.com"];

// here is where we check on their logged in status
app.use((req,res,next) => {
  res.locals.title="YellowCartwheel"
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      res.locals.user = req.user
      res.locals.loggedIn = true
    }
  else {
    res.locals.loggedIn = false
  }
  next()
})



// here are the authentication routes

app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})

app.get('/login', function(req,res){
  res.render('login',{})
})



// route for logging out
app.get('/logout', function(req, res) {
        req.session.destroy((error)=>{console.log("Error in destroying session: "+error)});
        console.log("session has been destroyed")
        req.logout();
        res.redirect('/');
    });


// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));


app.get('/login/authorized',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/loginerror'
        })
      );


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    res.locals.loggedIn = false
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      res.locals.loggedIn = true
      return next();
    } else {
      console.log("user has not been authenticated...")
      res.redirect('/login');
    }
}

// we require them to be logged in to see their profile
app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile')
    });

app.get('/editProfile',isLoggedIn, (req,res)=>{
  res.render('editProfile')
})



app.get('/profiles', isLoggedIn, profileController.getAllProfiles);
app.get('/showProfile/:id', isLoggedIn, profileController.getOneProfile);


app.post('/updateProfile',profileController.update)

// add page for editProfile and views
// add router for updateProfile and send browser to /profie

// END OF THE AUTHENTICATION ROUTES

app.use(function(req,res,next){
  console.log("about to look for routes!!!")
  //console.dir(req.headers)
  next()
});


app.get('/', function(req, res, next) {
  res.render('index',{title:"The Run Around"});
});


app.get('/ep1', function(req, res, next) {
  res.render('ep1',{title:"Mind Over Matter"});
});
app.get('/ep2', function(req, res, next) {
  res.render('ep2',{title:"Coach's Corner: Coach Singleton"});
});
app.get('/ep3', function(req, res, next) {
  res.render('ep3',{title:"Big Red"});
});
app.get('/ep4', function(req, res, next) {
  res.render('ep4',{title:"Deep Thoughts"});
});
app.get('/ep5', function(req, res, next) {
  res.render('ep5',{title:"Climbing the Mountain"});
});
app.get('/ep6', function(req, res, next) {
  res.render('ep6',{title:"Coach's Corner: Coach Fitzsimons"});
});
app.get('/ep7', function(req, res, next) {
  res.render('ep7',{title:"Rina's Rambles"});
});
app.get('/ep8', function(req, res, next) {
  res.render('ep8',{title:"College Recruiting and Running"});
});
app.get('/ep9', function(req, res, next) {
  res.render('ep9',{title:"Coach's Corner: Coach Agudelo"});
});
app.get('/ep10', function(req, res, next) {
  res.render('ep10',{title:"Fred Gressler Invitational"});
});
app.get('/ep11', function(req, res, next) {
  res.render('ep11',{title:"Coach's Corner: Coach Hidalgo"});
});
app.get('/ep12', function(req, res, next) {
  res.render('ep12',{title:"Coach Lacko, Somers, and the Lions Club"});
});
app.get('/ep13', function(req, res, next) {
  res.render('ep13',{title:"Rina's Run Around: Get to Know Me! With Abigail Roman"});
});
app.get('/ep14', function(req, res, next) {
  res.render('ep14',{title:"Singudelo/Fitzleton Relays Part 1"});
});
app.get('/ep15', function(req, res, next) {
  res.render('ep15',{title:"Close Up With a Hurdler!"});
});
app.get('/ep16', function(req, res, next) {
  res.render('ep16',{title:"Coach's Corner: Coach Furry"});
});
app.get('/ep17', function(req, res, next) {
  res.render('ep17',{title:"Singudelo Relays Part 2"});
});
app.get('/ep18', function(req, res, next) {
  res.render('ep18',{title:"Coach's Corner: Coach McCormick"});
});
app.get('/ep19', function(req, res, next) {
  res.render('ep19',{title:"Coach's Corner: Coach Tomici"});
});
app.get('/ep20', function(req, res, next) {
  res.render('ep20',{title:"Coach Simmons"});
});
app.get('/ep21', function(req, res, next) {
  res.render('ep21',{title:"Indoor Time Trials and Workouts"});
});
app.get('/ep22', function(req, res, next) {
  res.render('ep22',{title:"Part 1: White Plains vs. Ossining"});
});
app.get('/ep23', function(req, res, next) {
  res.render('ep23',{title:"Part 2: White Plains vs. Ossining with Abby"});
});
app.get('/ep24', function(req, res, next) {
  res.render('ep24',{title:"The Tracks of Indoor Track!"});
});
app.get('/ep25', function(req, res, next) {
  res.render('ep25',{title:"The Hispanic Games and Indoor Track with Zeph"});
});
app.get('/ep26', function(req, res, next) {
  res.render('ep26',{title:"Rina's First Two Indoor Meets"});
});
app.get('/ep27', function(req, res, next) {
  res.render('ep27',{title:"Underground Meets"});
});
app.get('/ep28', function(req, res, next) {
  res.render('ep28',{title:"Nick Panaro"});
});
app.get('/Rina', function(req, res, next) {
  res.render('Rina',{title:"Rina Stanghellini"});
});
app.get('/Website',(req,res,next)=>{
  res.render('Website',{title:"Website"});
})

app.get('/New', function(req, res, next) {
  res.render('New',{title:"New"});
});
app.get('/Runners', function(req, res, next) {
  res.render('Runners',{title:"Runners"});
});
app.get('/Podcasts', (req, res) => {
  res.render('Podcasts',{title:"Podcasts"});
});

app.get('/forum',forumPostController.getAllForumPosts)

app.post('/forum',forumPostController.saveForumPost)

app.post('/forumDelete',forumPostController.deleteForumPost)

app.get('/showPost/:id',
        forumPostController.attachAllForumComments,
        forumPostController.showOnePost)

app.get('/showPostComments/:id',
        forumPostController.attachAllForumComments,
        (req,res)=>{
          res.render('forumPostComments',{title:"comments"})
        })

app.post('/saveForumComment',forumPostController.saveForumComment)


// myform demo ...

app.post('/processform', commentController.saveComment)

app.get('/showComments', commentController.getAllComments)
// app.use('/', indexRouter);  // this is how we use a router to handle the / path
// but here we are more direct

app.get('/showComment/:id', commentController.getOneComment)

function processFormData(req,res,next){
  res.render('formdata',
     {title:"Form Data",url:req.body.url, coms:req.body.theComments})
}



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
