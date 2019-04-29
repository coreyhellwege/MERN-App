const express = require("express");
const router = express.Router();

// Route:         GET api/profile/test
// Description:   Tests profile route
// Access:        Public
router.get("/test", (req, res) => res.json({ message: "Profile Works" }));

module.exports = router;
