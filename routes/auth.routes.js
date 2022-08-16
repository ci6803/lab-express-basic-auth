const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const saltRounds = 10;

// GET route ==> to display the signup form to users
router.get("/signup", (req, res) => res.render("auth/signup"));

router.get("/userProfile", (req, res) => res.render("users/user-profile"));

// POST route ==> to process form data
router.post("/signup", (req, res, next) => {
  // console.log("The form data: ", req.body);

  const { username, password } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      //console.log("Newly created user is: ", userFromDB);
      //req.session.currentUser = userFromDB;
      res.redirect("/userProfile");
    })
    .catch((error) => console.log(error));
});

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Username is not registered. Try with other name.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        //req.session.currentUser = user;
        res.render("users/user-profile", { user });
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

// router.post("/signup", (req, res, next) => {
//   const { username, password } = req.body;

//   bcryptjs
//     .genSalt(saltRounds)
//     .then((salt) => bcryptjs.hash(password, salt))
//     .then((hashedPassword) => {
//       return User.create({
//         username,
//         passwordHash: hashedPassword,
//       });
//     })
//     .then((userFromDB) => {
//       res.redirect("/user-profile");
//     })
//     .catch((error) => next(error));
// });

module.exports = router;
