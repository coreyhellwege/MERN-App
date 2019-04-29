const express = require("express");
const router = express.Router();

// Route:         GET api/users/test
// Description:   Tests users route
// Access:        Public
router.get("/test", (req, res) => res.json({ message: "Users Works" }));

module.exports = router;
