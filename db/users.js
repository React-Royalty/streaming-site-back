// users db functions

const { client } = require("./index");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;


/**
 ** Create User
 * Inserts a new user into the database - unless a user with the input username already exists. Encrypts their input password with bcrypt.
 * @see /db/seed/createInitialUsers 
 * @param { string } username the username input by the new user
 * @param { string } password the password input by the new user
 * @returns { object } the newly created user
 */
async function createUser({ username, password }) {
  const saltValue = await bcrypt.genSalt(SALT_COUNT);
  const hashedPassword = await bcrypt.hash(password, saltValue);

  try {
    const { rows: [ user ] } = await client.query(`
      INSERT INTO users(username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `, [username, hashedPassword]);

    return user;
  } catch (error) {
    throw error;
  }
}


/**
 ** Get User
 * Checks user credentials - finds user by input username and compares input password to encrypted password.
 * @see getUserByUsername
 * @param { string } username the username input by the user
 * @param { string } password the password input by the user
 * @returns { object } the user object, now verified as having input the correct password
 */
async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    if ( user ) {
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if ( passwordsMatch ) {
        return user;  // you're in
      } else {
        console.log("Passwords don't match");
      }
    } else {
      console.log("No user with that username");
    }
  } catch (error) {
    throw error;
  }
}


/**
 ** Get User By ID
 * Selects user from database by their user id. 
 * @param { number } id the user's id
 * @returns { object } the user found by id - including: id and username
 */
async function getUserById(id) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT id, username
      FROM users
      WHERE id=$1;
    `, [id]);

    return user;
  } catch (error) {
    throw error;
  }
}


/**
 ** Get User By Username
 * Selects user from database by their username.
 * @param { string } username the user's username
 * @returns { object } the user object found by username - including: id, username and password
 * 
 */
async function getUserByUsername(username) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT id, username, password 
      FROM users 
      WHERE username=$1;
    `, [username]);

    return user;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername
}