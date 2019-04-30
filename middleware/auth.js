const jwt = require('jsonwebtoken');
const config = require('config');

// Export a middleware function to use the JWT to authenticate and access protected routes

// Note: middleware functions have access to the request and response objects

module.exports = function(req, res, next) { // next is a callback that runs at the end of the function to move onto the next middleware
  // Get token from the header
  const token = req.header('x-auth-token');

  // Check if no token
  if(!token) {
    return res.status(401.json({ msg: 'No token, authorisation denied' }))
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtsecret')); // if valid, decode the token
    req.user = decoded.user; // set the request user to the user in the decoded token
    next();
  } catch(err) {
    res.status(401).json({ msg: 'token is not valid '});
  }
}