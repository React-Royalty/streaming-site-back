// media api router

const express = require("express");
const mediaRouter = express.Router();

// function imports
const { getAllMedia, getMediaById, getMediaByTitle, createMedia, updateMedia, getMediaByIdWithCategories, deleteMedia } = require("../db/media");
const { deleteCategoryFromMedia } = require("../db/media_categories");
const { requireUser } = require("./utils");


// HTTP methods

/** 
** POST /api/media
 * Adds new media to media table in database. Requires an admin user
 * @see /db/media/createMedia 
 * TODO: Require an admin user
 */
// mediaRouter.post("/", requireUser, requireAdmin, async (req, res, next) => {
mediaRouter.post("/", requireUser, async (req, res, next) => {
  const { title, description, image } = req.body;

  try {
      const newMedia = await createMedia({ title, description, image });

      res.send({ 
        success: true,
        message: "New media created",
        media: newMedia
      });
  }catch ( { name, message } ) {
      next({ name, message })
  }
})


/** 
 ** PATCH /api/media/id
 * Updates media in the media table in the database. 
 * @see /db/media/updateMedia for updating media in database
 * TODO: Require an admin user
 */
mediaRouter.patch('/:mediaId', requireUser, async (req, res, next) => {
  const { mediaId } = req.params;
  const { title, description, image } = req.body;
  console.log('UPDATING MEDIA')

  const updateFields = {};

  if ( title ) updateFields.title = title;
  if ( description ) updateFields.description = description;
  if ( image ) updateFields.image = image;

  try {
    const updatedMedia = await updateMedia(mediaId, updateFields);
    console.log("updatedMedia : ", updatedMedia);

    if (updatedMedia) {
      res.send({
        success: true,
        message: "Media Updated",
        updatedMedia: updatedMedia
      })
    } else {
      next ({ 
        name: "MediaUpdateError",
        message: "An error occured while attempting to update media, nothing was updated"
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});



/** 
 ** DELETE /api/media/id
 * Hard deletes media from the media table in the database - making sure to delete all the media_categories whose media is being deleted
 * @see /db/media/getMediaByIdWithCategories for getting media with categories, so media categories can be deleted first
 * @see /db/media_categories/deleteCategoryFromMedia for deleting media categories before media
 * @see /db/media/deleteMedia for deleting media from db
 * TODO: Require admin user
 */
mediaRouter.delete("/:mediaId", requireUser, async (req, res, next) => {
  const { mediaId } = req.params;
  try {
    const [ media ] = await getMediaByIdWithCategories(mediaId);
    if ( media.categories.length ) {
      for ( let i = 0; i < media.categories.length; i++ ) {
        const deletedMediaCategory = await deleteCategoryFromMedia(media.categories[i].id);
        if ( deletedMediaCategory ) {
          console.log("media category deleted before deleting media");
        } else {
          next({
            name: "DeleteMediaCategoriesError",
            message: "There was an error deleting media categories for media deletion, nothig was deleted"
          })
        }
      }
    }
    const deletedMedia = await deleteMedia(mediaId);
    if ( deletedMedia ) {
      res.send({
        success: true,
        message: "Media deleted",
        deletedMedia: deletedMedia
      });
    } else {
      next({
        name: "DeleteMediaError",
        message: "There was an error deleting media, nothing was deleted"
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
})



/**
 ** GET /api/media
 * Sends back a list of all media in the database, including their categories
 * @see /db/media/getAllMedia 
 */
mediaRouter.get("/", async (req, res, next) => {
  try {
    const allMedia = await getAllMedia();

    res.send({ 
      success: true,
      allMedia: allMedia
    });
  } catch ({ name,message }){
    next({ name,message });
  }
});


/**
 ** GET /api/media/:id
 * Finds and sends back a media object by its ID
 * @see /db/media/getMediaById 
 */
mediaRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const media = await getMediaById(id);
    res.send({ 
      success: true,
      media: media
    });
  } catch ({ name, message }) {
    next({ name, message })
  }
});


/**
 ** GET /api/media/title/:title 
 * Finds and sends back a media object by its title
 * @see /db/media/getMediaByTitle
 */
mediaRouter.get('/title/:title', async (req,res,next) => {
  try{
    const { title } = req.params;
    const media = await getMediaByTitle(title);

    res.send({ 
      success: true,
      media: media
    });
  } catch ({ name, message }) {
    next({ name, message })
  }
});


module.exports = mediaRouter;