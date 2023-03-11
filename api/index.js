// api router

const express = require("express");
const router = express.Router();

// jwt middleware
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// function imports
const { getUserById } = require("../db/users");


// set "req.user" if possible
router.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if ( !auth ) { // nothing to see here... 🖐🛑
    next();

  } else if ( auth.startsWith(prefix) ) {
    const token = auth.slice(prefix.length);  // 🔑

    try {
      const parsedToken = jwt.verify(token, JWT_SECRET);
      const id = parsedToken && parsedToken.id;
      if (id) { // 👋
        req.user = await getUserById(id);
        console.log("req.user set!", req.user); // 👤
        next();
      }
    } catch (error) {
      next({
        name: "InvalidTokenError",  // ☝️🚫🤥
        message: "This token is not associated with any id"
      });
    }
  } else {
    next({
      name: "AuthorizationHeaderError", // 🔒
      message: `Authorization token must start with ${ prefix }`
    });
  }
});


// GET /api/health 🩺❤️
router.get("/health", async (req, res, next) => {
  res.send({ message: "The server is up, all is well." })
});

// ROUTER: /api/users 👥👩🏻‍💻
const usersRouter = require("./users");
router.use("/users", usersRouter);

// ROUTER: /api/media 📽️🎬
const mediaRouter = require("./media");
router.use("/media", mediaRouter);

// ROUTER: /api/categories 👹🤠
const categoriesRouter = require("./categories");
router.use("/categories", categoriesRouter);

// ROUTER: /api/media-categories 📁🗃️
const mediaCategoriesRouter = require("./media_categories");
router.use("/media-categories", mediaCategoriesRouter);

// Error handling
router.use((error, req, res, next) => {
  res.send({
    success: false,
    name: error.name,
    message: error.message
  });
});


module.exports = router;