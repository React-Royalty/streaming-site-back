// categories api router

const express = require("express");
const categoriesRouter = express.Router();

// function imports
const { getAllMedia, getMediaById, getMediaByTitle, createMedia } = require("../db/media");
const { requireUser } = require("./utils");


// HTTP methods

/**
 ** POST /api/categories
 * Creates a new category for the categories table in database.
 * TODO: 1. Require an admin user? 2. Add if / else if / else for requiring title and description?
*/
categoriesRouter.post("/", requireUser, async (req, res, next) => {

  })
  


/**
 ** PATCH /api/categories
 * Update an existing category in the categories table in database.
 * TODO: 1. Require an admin user?
*/
categoriesRouter.patch('/:categoryId', requireUser, async (req, res, next) => {

});



module.exports = categoriesRouter;