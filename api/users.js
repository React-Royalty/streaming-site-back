// users api router

const express = require("express");
const usersRouter = express.Router();

// jwt middleware
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// function imports
const { getUserByUsername, createUser, getUser } = require("../db/users");


// HTTP methods

/**
** POST /api/users/register
* Registers a new user, requires username length greater than 3 and password length greater than 8
* @see /db/users/getUserByUsername for making sure username isn't already taken
*/
usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if ( !username ) {  // require username
      next({ 
        name: "MissingCredentialsError", 
        message: "Missing username"
      });
    } else if ( !password ) { // require password
      next({
        name: "MissingCredentialsError",
        message: "Missing password"
      });
    } else if ( username.length < 3 ) { // require all usernames to be at least 3 characters long 
      next({
        name: "ShortUsernameError",
        message: "Username is too short, must be at least 3 characters"
      });
    } else if ( password.length < 8 ) { // require all passwords to be at least 8 characters long
      next({
        name: "ShortPasswordError",
        message: "Password is too short, must be at least 8 characters"
      });
    } else {
      const _user = await getUserByUsername(username);

      if ( _user ) {    // require unique username
        next ({
          name:"UserExistsError",
          message:"That username is already taken"
        });
      } else {    // okay, you may join
        const user = await createUser({ username, password });
        const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn:"1w" });
        res.send({
          success: true,
          message: "Thanks for signing up " + username + "!",
          token
        });
      }
    }
  } catch ({ name, message }) {
      next ({ name, message });
  }
});


/**
** POST /api/users/login
* Logs in a user if the input plaintext password matches encrypted database password
* @see /db/users/getUser for password verification
*/
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if ( !username ) {    // require username
    next({
      name:"MissingCredentialsError",
      message:"You must supply a username"
    });
  } else if ( !password ) { // require password
    next({
      name: "MissingCredentialsError",
      message: "You must supply a password"
    });
  }

  try { // verify that plaintext login password matches the saved hashed password before returning a json web token
    const user = await getUser({ username, password });

    if ( user ) { 
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn:"1w" });   // keep the id and username in the token
      res.send({
        success: true,
        message: "You're logged in " + username + "!",
        token: token
      });
    } else { 
      next({
        name: "IncorrectCredentialsError",
        message:"Username or password is incorrect"
      });
    }
  } catch ({ name, message }) {
    next ({ name, message });
  }
});


/**
** GET /api/users/me
* Sends back the logged-in user's data if a valid token is supplied in the header
*/
usersRouter.get("/me", async (req, res, next) => {
  try {
    if ( !req.user ) {
      next({
        name: "InvalidCredentialsError",
        message:"Nobody is logged in"
      });
    } else {
      res.send({ 
        success: true,
        message: req.user.username + " is logged in",
        user: req.user
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});


module.exports = usersRouter;