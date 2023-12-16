const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { validationResult, body } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "checkpayloadchangeornot";

//! Create a user using POST "api/auth/. doesn't require auth"
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 charachter").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
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
        return res.status(400).json({
          success,
          error: "Sorry a user with this email already exists",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })
        .then((user) => {
          const data = {
            user: {
              id: user.id,
            },
          };
          const authToken = jwt.sign(data, JWT_SECRET);
          console.log(authToken, "Check");
          success = true;
          // return res.json(user);
          return res.json({ success, authToken });
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
        success,
        message: "Somthing went wrong",
      });
    }
  }
);

//! Authenticate a user using POST "api/auth/login. No login required"
router.post(
  "/login",
  [
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Password Cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: error.array(),
      });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success,
          error: "Please Enter Valid Credentials",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success,
          error: "Please Enter Valid Credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      return res.status(500).send("Internal Server Error");
    }
  }
);

//! Get LoggedIn User Details
//TODO: To make scalable App need to use middleware, second argument is middleware
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    return res.status(500).send("  Internal Server Error");
  }
});

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
