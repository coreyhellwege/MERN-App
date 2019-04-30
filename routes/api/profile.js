const express = require("express");
const router = express.Router();

// Route:         GET api/profile
// Description:   Test route
// Access:        Public
router.get("/", (req, res) => {
  console.log(req.body);
  res.send("Profile route");
});

module.exports = router;
