// users api router

const express = require("express");
const usersRouter = express.Router();

// jwt middleware
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = process.env;

// function imports



// HTTP methods

// POST /api/users/register


// POST /api/users/login


// GET /api/users/me



module.exports = usersRouter;