require('dotenv').config();
const User = require("../model/userModel")
const bcrypt = require("bcryptjs");

exports.registerUser = (req, res) => {
    // Get the data from the request body
    const { firstName, lastName, email, password } = req.body;
    
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
                password
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

    console.log(email);
    
    try {
    // find the records on the db
    const user = await User.findOne({email,password});
    } catch (err) {
        console.log("user does not exist",err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.home = (req,res) => {
    res.json({message : "Welcome to home page"})
}

