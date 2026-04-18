const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
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
      callbackURL:
        "https://oraserver.online/auth/google/callback",
      proxy: true,
    },
    (accessToken, refreshToken, profile, done) => {
      (async () => {
        try {
          User.findOne({ email: profile.emails[0].value }).then((currentUser) => {
            if (currentUser) {
              currentUser.googleAccessToken = accessToken;
              currentUser.save().then(() => {
                done(null, currentUser);
              })

            } else {
              new User({
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                googleAccessToken: accessToken
              }).save()
              // console.log(`new user created : ${newUser}`);
             return done(null, newUser);
            }
          });
        } catch (error) {
            console.log("Google startegy error :", err);
            
            return done(err,null)
        }
      }

      )

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
        .then((user) => {
          // user email doesnt exist
          if (!user) {
            return done(null, false, { message: "Incorrect email." });
          }
          // if user password isnt stored on the db, googleAuth
          if (!user.password) {
            return done(null, false, {
              message: "Please use Google login or set a password.",
            });
          }

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              console.log("user logged in.");
              return done(null, user);
            } else {
              return done(null, false, { message: "Password not match" });
            }
          });
        })
        .catch((err) => done(err));
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "https://oraserver.online/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'name', 'photos', 'email'] // Added 'name' for first/last name
    },
    async function (accessToken, refreshToken, profile, done) {

      try {

        let currentUser = await User.findOne({ facebookId: profile.id });

        if (currentUser) {
          console.log(`user already exist : ${currentUser.displayName}`);
          done(null, currentUser);
        } else {
          const newUser = await new User({
            facebookId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            displayName: profile.displayName
          }).save()
          // console.log(`new user created : ${newUser.displayName}`);
          done(null, newUser);
        }
      } catch (err) {
        console.error("Err in Facebook Strategy.", err);
        return done(err, null)
      }
    }))
