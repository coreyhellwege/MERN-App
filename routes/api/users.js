const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// We're using Express Validator to validate User post requests
const { check, validationResult } = require("express-validator/check");

// Import User model
const User = require("../../models/User");

// Route:         POST api/users
// Description:   Register user
// Access:        Public
router.post(
  "/",
  [
    // set validations in middleware
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email address").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    console.log(req.body); // req.body is the object of data sent to this route
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // send the above error messages
    }

    const { name, email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      if (user) {
        res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }

      // Get User's gravatar
      const avatar = gravatar.url(email, {
        s: "200", // Default size
        r: "pg", // Rating (no explicit content)
        d: "mm" // Default image
      });

      // Create a new User instance
      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt password with bcrypt
      const salt = await bcrypt.genSalt(10);

      // Hash plain text password
      user.password = await bcrypt.hash(password, salt);

      // Save User to the database
      await user.save();

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

// Notes: Add 'await' before anything that returns a promise (instead of using .then .catch)
// Decode a JWT: https://jwt.io

module.exports = router;
