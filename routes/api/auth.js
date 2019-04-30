const express = require("express");
const router = express.Router();

// Route:         POST api/auth
// Description:   Test route
// Access:        Public
router.get("/", (req, res) => {
  console.log(req.body);
  res.send("Auth route");
});

module.exports = router;
