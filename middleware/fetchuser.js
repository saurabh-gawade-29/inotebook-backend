var jwt = require("jsonwebtoken");
const JWT_SECRET = "checkpayloadchangeornot";

//! WHAT IS NEXT?
/*
* 
1.  here we create a middleware 
2.  see the auth.js 
    router.post("/userdetail", fetchuser, async (req, res) => {}
3. in above line we call this middleware but after calling need to call next callback function which is (req, res)=> {}
*/
const fetchuser = (req, res, next) => {
  //! Get the user from JWT Token and into req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({
      error: "Please Authenticalte a valid Token",
    });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    console.log(error, "Error in fetchUserMiddleWare");
    res.status(401).send({
      error: "Please Authenticalte a valid Token",
    });
  }
};

module.exports = fetchuser;
