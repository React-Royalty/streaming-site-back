
function requireUser(req, res, next) {
  console.log("req.user:", req.user);
  if ( !req.user ) {
      next({
          name: "MissingUserError",
          message: "You must be logged in to perform this action"
      });
  }

  next();
}

module.exports = {
  requireUser
}
