// media api router

const express = require("express");
const mediaRouter = express.Router();

// function imports
const { getAllMedia, getMediaById, getMediaByTitle, createMedia } = require("../db/media");
const { requireUser } = require("./utils");


// HTTP methods

/** 
** POST /api/media
* Adds new media to media table in database. Requires an admin user
* TODO: Requires an admin user
*/
// mediaRouter.post("/", requireUser, requireAdmin, async (req, res, next) => {
mediaRouter.post("/", requireUser, async (req, res, next) => {
  try {
      // console.log(req.body)
      const { title, description, image } = req.body;
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
* Updates media in the media table in the database. Requires an admin user
* TODO: WRITE
*/




/** 
** DELETE /api/media/id
* Deletes media from the media table in the database. Requires an admin user
* TODO: WRITE
*/


/**
** GET /api/media
* Sends back a list of all media in the database
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