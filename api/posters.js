// media api router

const express = require("express");
const postersRouter = express.Router();

// function imports
const { createPoster } = require("../db/posters");
const { requireUser } = require("./utils");


// HTTP methods

/**
 ** POST /api/posters
 * Handles API fetches to add a new poster to the database
 * @see /db/posters/createPoster
 * TODO: Require an admin user?
*/
postersRouter.post("/", requireUser, async (req, res, next) => {
  const { mediaId, image, wide } = req.body;
  
  try {
    const poster = await createPoster({ mediaId, image, wide});

    if ( poster ) {
      res.send({
        success: true,
        message: "New poster created",
        poster: poster
      });
    } else {
      next({
        name: "NewPosterPostError",
        message: "An error occurred while posting new poster"
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
})



/** 
 ** PATCH /api/posters/id
 * Handles API fetches to update an existing poster in the database. 
 * @see /db/posters/updatePoster for updating posters in database
 * TODO: Require an admin user? TODO: WRITE
 */
postersRouter.patch('/:posterId', requireUser, async (req, res, next) => {
  const { posterId } = req.params;
  const { mediaId, image, wide } = req.body;

  const updateFields = {};

  if ( mediaId ) updateFields.mediaId = mediaId;
  if ( image ) updateFields.image = image;
  if ( wide ) updateFields.wide = wide;

  try {
    const updatedPoster = await updatePoster(posterId, updateFields);

    if (updatedPoster) {
      res.send({
        success: true,
        message: "Poster updated",
        updatedPoster: updatedPoster
      })
    } else {
      next ({ 
        name: "PosterUpdateError",
        message: "An error occured while attempting to update poster, nothing was updated"
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});



module.exports = postersRouter;