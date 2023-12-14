const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { validationResult, body } = require("express-validator");

//? Create a user using POST "api/auth/. doesn't require auth"
router.post(
  "/",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 charachter").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    //Check the email already exist or not
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      })
        .then((user) => {
          return res.json({ message: "User Created!" });
        })
        .catch((error) => {
          console.log(error, "Error in Auth.js");
          res.json({
            error: "This User is Already Exist",
            message: error.message,
          });
        });
      // no need to save user.save explicitly
      // user,save();
    } catch (error) {
      console.log(error, "Error in Try Catch block of auth.js");
      res.status(500).json({
        message: "Somthing went wrong",
      });
    }
  }
);

module.exports = router;

/*
!Question what is in req.body and res.body
console.log(res.body);
console.log(req.body);
* You will get input and output like this
{
    "name": "komal",
    "email": "komal@gmail.com",
    "password": "1234"
}
*/
