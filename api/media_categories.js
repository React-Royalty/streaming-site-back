// media categories api router

const express = require("express");
const mediaCategoriesRouter = express.Router();

// function imports
const { getAllMedia, getMediaById, getMediaByTitle, createMedia } = require("../db/media");
const { requireUser } = require("./utils");


// HTTP methods
