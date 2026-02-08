const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy; // 1. Import LocalStrategy
const bcrypt = require("bcryptjs");
const User = require("../model/userModel");
require("dotenv").config();

// save user id to the session
passport.serializeUser((user, done) => {
  done(null, user.id); /* user.id from mongoDb */
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://image-uploader-backend-yzqj.onrender.com/auth/google/callback",
      proxy: true ,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ email: profile.emails[0].value }).then((currentUser) => {
        if (currentUser) {
          // user exists
          console.log(`user is : ${currentUser}`);
          done(null, currentUser);
        } else {
          // user does not exists
          new User({
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
          })
            .save()
            .then((newUser) => {
              console.log(`new user created : ${newUser}`);
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
        (email, password, done) => {
            User.findOne({ email: email })
                .then(user => {
                    // user email doesnt exist
                    if (!user) {
                        return done(null, false, { message: 'Incorrect email.' });
                    }
                    // if user password isnt stored on the db, googleAuth
                    if (!user.password) {
                        return done(null, false, { message: 'Please use Google login or set a password.' });
                    }

                    bcrypt.compare(password, user.password, (err,isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            console.log("user logged in.");
                            return done(null,user);
                            
                        } else {
                            return done(null, false, { message : "Password not match"})
                        }
                    });
                })
                .catch(err => done(err))
            })
);
