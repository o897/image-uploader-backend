const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const authController = require("../controller/authController");
const User = require("../model/userModel");

// login users and registering users
router.get("/success", (req, res) => {
  if (req.user) {
    //request the user object
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
    });    
  } else {
    res.status(500).json({
      message: "no such user",
    });
  }
}),

router.post("/register", authController.registerUser);

router.get("/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});



// When logout, redirect to client
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid", {
        secure: true,
        sameSite: "none",
      });
      res.status(200).json({ message: "Logged out" });
    });
  });
});

// auth with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email","https://www.googleapis.com/auth/youtube.readonly"],
    accessType : "offline",
    prompt : "consent"
  })
);

// callback route for google to redirect to
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.HOME_URL, // Redirect to react app
    failureRedirect: "/login/failed",
  })
);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ success: false, message: info.message });

    // uses passport to store user in the session
    req.login(user, (err) => {
      if (err) return next(err);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: user,
      });
    });
  })(req, res, next);
});

router.post("/register", authController.registerUser);
// router.get('/register',loginController.register)

router.put("/register/update", async (req, res) => {
  try {
    const { fname, lname, uname, about, ytb, fcbkuname, privacy } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      {
        $set: {
          firstName: fname,
          lastName: lname,
          username: uname,
          about: about,
          youtube: ytb,
          facebook: fcbkuname,
        }
      },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated", user: updatedUser });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// facebook auth
router.get("/facebook", passport.authenticate("facebook", {scope : ['email']}));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/failed" }),
  function (req, res) {
    //successful authentication, redirect to the home page
    res.redirect(process.env.PROFILE_URL);
  }
);
module.exports = router;
