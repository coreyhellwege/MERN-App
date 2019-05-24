const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");

// Route:         POST api/auth
// Description:   Access route
// Access:        Protected
router.get("/", auth, async (req, res) => {
  try {
    // we can access req.user because this is a protected route
    const user = await User.findById(req.user.id).select("-password"); // we only want the ID, not password
    res.json(user);
  } catch (err) {
    console.err(err.message);
    res.status(500).send("Server Error");
  }
});

// Route:         POST api/auth
// Description:   Authenticate user and get token
// Access:        Public
router.post(
  "/",
  [
    check("email", "Please include a valid email address").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    console.log(req.body); // req.body is the object of data sent to this route
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // send the above error messages
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      // Return error if user isn't found
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Check that password matches
      const isMatch = await bcrypt.compare(password, user.password); // compare method returns a promise. first arg is plain text pass, second arg is encrypted pass

      // Return error if passwords don't match
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Create the jwt payload to include User ID
      const payload = {
        user: {
          id: user.id
        }
      };

      // Sign the token
      jwt.sign(
        payload, // pass in the payload
        config.get("jwtSecret"), // pass in the secret
        { expiresIn: 360000 }, // set an expiration timeframe
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // if success, send token to the client
        }
      );
    } catch (err) {
      console.error(err.message);
      res.send(500).send("Server error");
    }
  }
);

module.exports = router;
