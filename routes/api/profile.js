const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// Route:         GET api/profile/me
// Description:   Get current user's profile
// Access:        Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    ); // we're using the populate method to bring in name and avatar fields from user

    // Check if there's no profile
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    // Send profile
    res.json(profile);
  } catch (err) {
    console.err(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
