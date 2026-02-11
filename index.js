require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const session = require("express-session");
const passport = require("passport");
const web = require("./routes/web");
// 1. Load config/Strategy
require("./config/passport");

const allowedOrigins = [
  "https://inquisitive-chimera-40f663.netlify.app",
  "https://image-uploader-frontend-agg6.onrender.com",
  "https://darling-ganache-c749ed.netlify.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/", web);
app.listen(3000, () => console.log("listening on port 3000"));
