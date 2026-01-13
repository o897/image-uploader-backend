const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const authController = require("../controller/authController")
// login users and registering users
// router.post('/',authController.loginUser);



router.get("/hey", (req,res) => {
    res.send("hey")
})

router.get("/success", (req,res) => {
    if(req.user) {
        res.status(200).json({
            success : true,
            message : "successful",
            user : req.user,
        })
    } else {
        res.status(500).json({
            message : "no such user"
        })
    }
}),

router.get("/failed", (req,res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    })
})

// When logout, redirect to client
router.get('/logout', (req, res) => {
    req.logout(() => {
        console.log("logging user out");
        res.redirect(process.env.CLIENT_URL);
    });
});

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// callback route for google to redirect to
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: process.env.HOME_URL, // Redirect to react app
    failureRedirect: '/login/failed'
}));


// normal register email + password
router.post('/',authController.registerUser);

router.post('/login', (req,res,next) => {
passport.authenticate('local', (err,user,info) => {
    if (err) return next(err);
    if(!user) return res.status(401).json({success : false, message :info.message});

    req.login(user, (err) => {
        if (err) return next(err);
        console.log(user);
        return res.status(200).json({
            success : true,
            message: "Login successful",
            user : user
        });
    });
})(req,res,next);
});

// router.post('/register', userController.register)
// router.get('/register',loginController.register)

// facebook auth
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook',{failureRedirect : '/login'}),
    function (req,res) {
        //successful authentication, redirect to the home page
        res.redirect('/');
    }
)
module.exports = router;