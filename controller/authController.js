require('dotenv').config();
const User = require("../model/userModel")
const bcrypt = require("bcryptjs");

// exports.registerUser = async (req, res) => {
//   try {const mongoose = require('../config/mongoose')

//     const { email, password } = req.body;

//     // validate inputs
//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already in use." });
//     }

//     // save new user
//     const newUser = new User({ email, password });
//     newUser.save();

//     res.status(201).json(newUser);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// ... other imports

exports.registerUser = (req, res) => {
    // Get the data from the request body
    const { firstName, lastName, email, password } = req.body;

    // ---===[ THIS IS THE CRITICAL FIX ]===---
    // Use .trim() to remove any leading/trailing whitespace or newlines from the email.
    const trimmedEmail = email.trim();

    // Check if a user with the CLEANED email already exists
    User.findOne({ email: trimmedEmail }).then(user => {
        // if i find a user return user email
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        } else {
            // create a new user
            const newUser = new User({
                firstName,
                lastName,
                email: trimmedEmail, //trimmed mail
            });

            // Hash password and save user...
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            // Log the user in automatically after they register
                            req.login(user, (err) => {
                                if (err) throw err;
                                res.status(201).json({ // 201 Created is more appropriate here
                                    success: true,
                                    message: "Registration successful",
                                    user: user
                                });
                            });
                        })
                        .catch(err => console.log(err));
                });
            });
        }
    });
};

exports.loginUser = async (req,res) => {
    // request the email and the password from the body    
    const {email, password} = req.body

    try {
    // find the records on the db
    const user = await User.findOne({email,password});
    } catch (err) {
        console.log("use does not exist",err);
    }

    // res.json({message : "logged in"})
    res.redirect(process.env.HOME_URL);
};

exports.home = (req,res) => {
    res.json({message : "Welcome to home page"})
}

