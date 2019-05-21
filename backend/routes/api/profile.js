const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

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

// Route:         POST api/profile
// Description:   Create or update user profile
// Access:        Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract all fields from the body of the request
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // Build profile object to insert into database
    const profileFields = {}; // initialize object first
    profileFields.user = req.user.id;
    if (company) profileFields.company = company; // add each field
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim()); // turn into array and remove spaces
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    // Update and insert the data
    try {
      let profile = await Profile.findOne({ user: req.user.id }); // find the user by the token from the request

      // if profile is found, update profile
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      // if no profile is found, create profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Route:         GET api/profile
// Description:   Get all profiles
// Access:        Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Route:         GET api/profile/user/:user_id
// Description:   Get profile by user ID
// Access:        Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]); // get the ID from the URL via req.params

    // check there's a user profile
    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    // If not a valid object ID
    if ((err.kind = "OjectId")) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// Route:         DELETE api/profile
// Description:   Delete profile, user and posts
// Access:        Private
router.delete("/", auth, async (req, res) => {
  try {
    // Remove posts
    await Post.deleteMany({ user: req.user.id });
    // Then remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // And finally, remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Route:         PUT api/profile/experience
// Description:   Add profile experience
// Access:        Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // get body data (using object destructuring)
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    // create an object with the data submitted by the user
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      // fetch the profile we want to add to
      const profile = await Profile.findOne({ user: req.user.id });
      // add new experience to profile
      profile.experience.unshift(newExp); // unshift is similar to push but adds to the beginning of the array instead of the end
      await profile.save();
      // response
      res.json(profile);
    } catch (err) {
      res.status(500).send("Server Error");
    }
  }
);

// Route:         DELETE api/profile/experience/:exp_id
// Description:   Delete experience from profile
// Access:        Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // Get remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    // Remove it from experience
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Route:         PUT api/profile/education
// Description:   Add profile education
// Access:        Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of study is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // get body data (using object destructuring)
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    // create an object with the data submitted by the user
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      // fetch the profile we want to add to
      const profile = await Profile.findOne({ user: req.user.id });
      // add new education to profile
      profile.education.unshift(newEdu); // unshift is similar to push but adds to the beginning of the array instead of the end
      await profile.save();
      // response
      res.json(profile);
    } catch (err) {
      res.status(500).send("Server Error");
    }
  }
);

// Route:         DELETE api/profile/education/:edu_id
// Description:   Delete education from profile
// Access:        Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // Get remove index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);
    // Remove it from education
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Route:         GET api/profile/github/:username
// Description:   Get user's repos from Github
// Access:        Public
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Github profile found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
