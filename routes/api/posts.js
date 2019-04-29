const express = require("express");
const router = express.Router();

// Route:         GET api/posts/test
// Description:   Tests post route
// Access:        Public
router.get("/test", (req, res) => res.json({ message: "Posts Works" }));

module.exports = router;
