// categories api router

const express = require("express");
const categoriesRouter = express.Router();

// function imports
const { getAllCategories, createCategory, getHomepageCategoriesWithMedia } = require("../db/categories");
const { getAllCategoriesWithMedia } = require("../db/media");
const { choosePosters } = require("../db/posters");
const { requireUser } = require("./utils");


// HTTP methods

/**
 ** POST /api/categories
 * Creates a new category for the categories table in database.
 * TODO: 1. Require an admin user?
*/
categoriesRouter.post("/", requireUser, async (req, res, next) => {
    const { name } = req.body;
    
    try {
      const category = await createCategory(name);
      console.log("making new category ,", name);
      console.log(category);

      if ( category ) {
        res.send({
          success: true,
          message: "New category created",
          category: category
        });
      } else {
        next({
          name: "NewCategoryPostError",
          message: "A category with that name already exists"
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  })
  


/**
 ** GET /api/categories/homepage
 * Get and send back a list of all homepage categories in the database with respective media included
*/
categoriesRouter.get('/homepage', async (req, res, next) => {
  try {
      const categories = await getHomepageCategoriesWithMedia();

      if ( categories ) {
        categories.homepage.forEach((category) => {
          category.media.forEach((indivMedia) => choosePosters(indivMedia));
        })
        categories.special.forEach((category) => {
          category.media.forEach((indivMedia) => choosePosters(indivMedia));
        })
        res.send({ 
          success: true,
          categories: categories
        });
      } else {
        next({
          name: "getAllCategories Error",
          message: "There was an error getting categories"
        });
      }

  } catch ({ name, message }){
      next({ name, message });
  }
});


module.exports = categoriesRouter;