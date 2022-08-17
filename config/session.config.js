// config/session.config.js

// require session
const session = require("express-session");
const MongoStore = require("connect-mongo"); // connect MONGO to store the sessions
const mongoose = require("mongoose");

// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
module.exports = (app) => {
  // <== app is just a placeholder here
  // but will become a real "app" in the app.js
  // when this file gets imported/required there

  // required for the app when deployed to Heroku (in production)
  app.set("trust proxy", 1);

  //use session
  app.use(
    session({
      secret: process.env.SESS_SECRET, // a srting (save in .env) allow us to generate the session ID - required (for our cookies and sessions)
      resave: false, // forces the session to be saved to the session store ('flase' because mongo implements the touch method)
      // want to automatically store the sessions
      saveUninitialized: false, // forces a session that is 'uninitialised' (new but not modified) to be saved // recommend to set to 'false'
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24h // that you want your cookie to be (in ms)
      },
      store: new MongoStore({
        // connecting between Mongo DB and the session page - so it can extent the accessibility to how long we want
        // create the database
        mongoUrl: "mongodb://localhost/lab-express-basic-auth",
        ttl: 60 * 60 * 24, // 60sec * 60min * 24h => 1 day (in s)
        // (not mandatory; default: 14 days) time to live in the database
      }),
    })
  );
};

// module.exports = (app) => {
//   app.set("trust proxy", 1);

//   app.use(
//     session({
//       secret: process.env.SESS_SECRET,
//       resave: true,
//       saveUninitialized: false,
//       cookie: {
//         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//         secure: process.env.NODE_ENV === "production",
//         httpOnly: true,
//         maxAge: 60000,
//       }, // ADDED code below !!!
//       store: MongoStore.create({
//         mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/basic-auth",

//         // ttl => time to live
//         // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
//       }),
//     })
//   );
// };
