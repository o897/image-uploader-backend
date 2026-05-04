const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const authController = require("../controller/authController");
const User = require("../model/userModel");
const fileUpload = require('../middleware/fileUpload'); // ← wherever multer is configured
const fileUpload = require("../middleware/multer");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");


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
      return res.status(401).json({ success: false, message: "Email doesn't exist" });

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

router.delete("/delete", async (req,res) => {

  try {
    if(!req.user) {
      return res.status(401).json({message : "Unauthorized"});
    }

    await User.findByIdAndDelete(req.user._id);

    req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie("connect.sid", {
          secure: true,
          sameSite: "none",
        });
        res.status(200).json({ message: "Account deleted" });
      });
    });


  } catch (error) {

    res.status(500).json({message : "Server error ", error : err.message})
    
  }
})

router.post("/register", authController.registerUser);
// router.get('/register',loginController.register)

router.put("/update", upload.single("photo"), async (req, res) => {
  try {
    const { fname, lname, uname, about, ytb, fcbkuname, privacy } = req.body;

    const updates = {};
    if (fname) updates.firstName = fname;
    if (lname) updates.lastName = lname;
    if (uname) updates.uname = uname;
    if (about) updates.about = about;
    if (ytb) updates.ytb = ytb;
    if (fcbkuname) updates.fcbkuname = fcbkuname;

    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) resolve(result);
            else reject(error);
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();
      updates.photo = result.secure_url; 
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
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

router.post("/facebook/delete", async (req, res) => {
  try {
    const { signed_request } = req.body;

    // decode the signed request from facebook
    const payload = signed_request.split('.')[1];
    const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));

    const facebookId = data.user_id;

    // delete user by facebookId
    await User.findOneAndDelete({ facebookId: facebookId });

    // facebook expects this specific response
    res.json({
      url: `https://usememoir.online/deletion-status`,
      confirmation_code: facebookId
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/facebook/delete", async (req, res) => {
  try {
    const { signed_request } = req.body;

    const payload = signed_request.split('.')[1];
    const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));

    const facebookId = data.user_id;

    await User.findOneAndDelete({ facebookId: facebookId });

    res.json({
      url: `https://usememoir.online/deletion-status`,
      confirmation_code: facebookId
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
