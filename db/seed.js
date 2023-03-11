// db seed functions

const { client } = require("./index");

// db function imports
const { createUser } = require("./users");
const { createMedia, getMediaByTitle } = require("./media");
const { createCategory } = require("./categories");
const { addCategoryToMedia } = require("./media_categories");
// db testing function imports
const { testDB } = require("./TESTS");


/**
 ** Create Tables
 * Creates tables [users, media, categories, media_categories] for database.
 */
async function createTables() {
  console.log("\n┬─┬ノ(ಠ_ಠノ) creating tables...");
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
      
      CREATE TABLE media (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(500)
      );

      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE media_categories (
        id SERIAL PRIMARY KEY,
        "mediaId" INTEGER REFERENCES media(id),
        "categoryId" INTEGER REFERENCES categories(id),
        UNIQUE ("mediaId", "categoryId")
      );
    `);
    console.log("...┏━┓┏━┓┏━┓ ︵ /(^.^/) tables created!")
  } catch (error) {
    console.error("Error creating tables");
    throw error;
  }
}


/**
 ** Drop Tables
 * Drops all tables from database.
 */
async function dropTables() {
  console.log("\n(┛◉Д◉)┛彡┻━┻ dropping tables...")
  try {
    await client.query (`
      DROP TABLE IF EXISTS media_categories;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS media;
      DROP TABLE IF EXISTS users;
    `);
    console.log("...┻━┻︵ \(°□°)/ ︵ ┻━┻ tables dropped!")
  } catch (error) {
    console.error("Error dropping tables");
    throw error;
  }
}


/**
 ** Create Initial Users
 * Creates initial users for the users table in the database.
 * @see /db/users/createUser 
 */
async function createInitialUsers() {
  console.log("\n👤🧍 CREATING INITIAL USERS...");
  try {
      const usersToCreate = [
          { username: "madi", password: "queenofreact" },
          { username: "drew", password: "kingofreact" },
          { username: "parvati", password: "queenofsurvivor" },
          { username: "taylor", password: "kingofmyheart" },
      ];
      const users = await Promise.all(usersToCreate.map(createUser));
      console.log("users:", users);
      console.log("...👥🌏 USERS CREATED!");
  } catch (error) {
      console.error("Error creating users");
      throw error;
  }
}


/**
 ** Create Initial Media
 * Creates initial users for the users table in the database.
 * @see /db/media/createMedia 
 */
async function createInitialMedia() {
  console.log("\n🎬🎥 CREATING INITIAL MEDIA...");
  try {
    const mediaToCreate = [
      { title: "Everything Everywhere All At Once", description: "then I will cherish these few specks of time", image: "https://m.media-amazon.com/images/I/A1f7vq1AwuL.jpg" },
      { title: "Hunt for the Wilderpeople", description: "once rejected, now accepted", image: "https://m.media-amazon.com/images/M/MV5BMjY1M2RhNWUtYzJiMC00ZWU4LWE3ODEtNDMxYmMxMzRlNTY1XkEyXkFqcGdeQXVyMTA4NjE0NjEy._V1_.jpg" },
      { title: "Little Women", description: "women - ", image: "https://m.media-amazon.com/images/I/51UoPuX386L._AC_UF894,1000_QL80_.jpg" },
      { title: "Midsommar", description: "do you feel held by him? does he feel like home to you?", image: "https://m.media-amazon.com/images/M/MV5BMzQxNzQzOTQwM15BMl5BanBnXkFtZTgwMDQ2NTcwODM@._V1_.jpg" },
      { title: "Megamind", description: "presentation!", image: "https://cdn.shopify.com/s/files/1/0445/8600/8737/products/0fa342e3-605a-4b5d-b4c3-c52d4d30efcb_7b291b9e-eb84-4039-bfc8-c5fd29198b4a.jpg?v=1671065453" },
      { title: "Portrait of a Lady on Fire", description: "do all lovers feel they're inventing something?", image: "https://cdn.posteritati.com/posters/000/000/064/842/portrait-of-a-lady-on-fire-md-web.jpg" },
      { title: "Parasite", description: "eat the rich etc", image: "https://m.media-amazon.com/images/I/91KArYP03YL._AC_UF894,1000_QL80_.jpg" },
      { title: "Spider-Man: Into the Spider-Verse", description: "you can wear the mask!", image: "https://m.media-amazon.com/images/I/71QcRDosnsL._AC_SY879_.jpg" },
      { title: "Lady Bird", description: "oh being a mother's daughter", image: "https://m.media-amazon.com/images/I/811IspJXndL.jpg" },
      { title: "Booksmart", description: "put your heel in my corn hole", image: "https://m.media-amazon.com/images/M/MV5BMjEzMjcxNjA2Nl5BMl5BanBnXkFtZTgwMjAxMDM2NzM@._V1_.jpg" },
      { title: "Black Swan", description: "now kiss", image: "https://i5.walmartimages.com/asr/2765ed1a-9da8-4d95-8967-bece9a8e9a04_1.9f6520582c44bc53c3d3abc2dbbd3db4.jpeg" },
      { title: "The Blair Witch Project", description: "goat", image: "https://fffmovieposters.com/wp-content/uploads/22744.jpg" },
      { title: "Thor Ragnarok", description: "tessaaaaaaaaaaaaaaaaaaaaaa", image: "https://m.media-amazon.com/images/I/A1HBBNzBdxL.jpg" },
      { title: "Jennifer's Body", description: "I'm not killing people, I'm killing boys!", image: "https://m.media-amazon.com/images/I/81Y0vBkhs3L.jpg" },
      { title: "13 Going On 30", description: "thirty, flirty, and thriving", image: "https://m.media-amazon.com/images/M/MV5BMjE1NzI5NTkwMF5BMl5BanBnXkFtZTYwOTA4NzY2._V1_FMjpg_UX1000_.jpg" },
      { title: "Taylor Swift Reputation Stadium Tour", description: "are you ready for it??", image: "https://m.media-amazon.com/images/M/MV5BMjU3NmQ0MzMtZTIwMS00NDA5LWEzYTQtMjU0MzgzYTI0OTE5XkEyXkFqcGdeQXVyNTYyOTk2Mzk@._V1_FMjpg_UX1000_.jpg" },


      { title: "Stranger Things", description: "bitchin", image: "https://i.ebayimg.com/images/g/7tEAAOSwOPVijmX~/s-l1600.jpg" },
      { title: "Grey's Anatomy", description: "he's very dreamy, but he's not the sun, you are", image: "https://flxt.tmsimg.com/assets/p9977774_b_v8_aa.jpg" },
      { title: "Survivor", description: "You know what Jeff? I think it would be downright depressing to sit and watch green bananas turn yellow without my debaucherous little villains... so", image: "https://image.tmdb.org/t/p/original/5TVfHUnY84VAVur8FNllbkgnKmQ.jpg" },
      { title: "Killing Eve", description: "have you told your husband about us yet eve?", image: "https://i.etsystatic.com/31384974/r/il/4c7670/4108961290/il_570xN.4108961290_kz81.jpg" },
      { title: "The Vampire Diaries", description: "team katherine", image: "https://m.media-amazon.com/images/I/818mT+CFptL._AC_UF894,1000_QL80_.jpg" },
      { title: "WandaVision", description: "evan peters quicksilver?!?!", image: "https://m.media-amazon.com/images/I/91uThdajb1L._AC_SY879_.jpg" },
      { title: "Derry Girls", description: "what's the craic", image: "https://image.tmdb.org/t/p/original/iOAiJF2Q9vX8x8n2GBP3E6sCE8e.jpg" },
      { title: "The White Lotus", description: "mike white king goliath", image: "https://posterspy.com/wp-content/uploads/2023/01/White-Lotus-2-Portrait-V2.jpg" },
      { title: "Santa Clarita Diet", description: "gone too soon", image: "https://m.media-amazon.com/images/M/MV5BNTIwMDkzNTMwMF5BMl5BanBnXkFtZTgwNDA4MjI2NzM@._V1_.jpg" },
      { title: "Fleabag", description: "claire it's french!", image: "https://m.media-amazon.com/images/I/51fd7hCV6AL._AC_UF894,1000_QL80_.jpg" },

      // { title: "", description: "", image: "" },

      ];
      const media = await Promise.all(mediaToCreate.map(createMedia));
      console.log("media:", media);
      console.log("... 🍿🎞️ MEDIA CREATED!");
  } catch (error) {
      console.error("Error creating media");
      throw error;
  }
}


/**
 ** Create Initial Categories
 * Creates initial categories for categories table in the database.
 * @see /db/categories/createCategory 
 */
async function createInitialCategories() {
  console.log("\n📋✍️ CREATING INITIAL CATEGORIES...");
  try {
    const categoriesToCreate = [
      { name: "Movie" },
      { name: "Show" },
      { name: "Animation" },
      { name: "Madi's Favorites" },
      { name: "Drew's Favorites" },
    ];

    const categories = await Promise.all(categoriesToCreate.map(createCategory));
    console.log("categories:", categories);
    console.log("📃🗂️ ...CATEGORIES CREATED!");
  } catch (error) {
      console.error("Error creating users");
      throw error;
  }
}


/**
 ** Create Initial Media Categories
 * Attach initial categories to media
 * @see /db/media_categories/addCategoryToMedia 
 */
async function createInitialMediaCategories() {
  console.log("\n👇⭐ CREATING INITIAL MEDIA CATEGORIES...");
  try {

    // console.log("get by title: ", await getMediaByTitle("Killing Eve"));
    // console.log("ID: ", await getMediaByTitle("Killing Eve").id);
    // mediaCategoriesToCreate = [ // TODO: MAKE WORK
    //   { mediaId: await getMediaByTitle("Killing Eve").id, categoryId: 2 },
    //   { mediaId: await getMediaByTitle("Killing Eve").id, categoryId: 4 },
    //   { mediaId: await getMediaByTitle("Survivor").id, categoryId: 2 },
    //   { mediaId: await getMediaByTitle("Survivor").id, categoryId: 4 },
    // ];

    mediaCategoriesToCreate = [ // TODO: GET RID OF HARD CODED IDS
      { mediaId: 20, categoryId: 2 },
      { mediaId: 20, categoryId: 4 },
      { mediaId: 19, categoryId: 2 },
      { mediaId: 19, categoryId: 4 },
    ];

    const mediaCategories = await Promise.all(mediaCategoriesToCreate.map(addCategoryToMedia));
    console.log("media categories:", mediaCategories);
    console.log("✅🎯 ... MEDIA CATEGORIES CREATED!");
  } catch (error) {
      console.error("Error creating users");
      throw error;
  }
}





async function rebuildDB(){
  client.connect();
  console.log("\n\n\n------------------------------ 🔨 🪛 🔧 REBUILDING DATABASE 🔨 🪛 🔧 ------------------------------\n\n");
  await dropTables();
  await createTables();
  await createInitialUsers();
  await createInitialMedia();
  await createInitialCategories();
  await createInitialMediaCategories();
  console.log("\n\n------------------------ 🔨 🪛 🔧 FINISHED REBUILDING DATABASE 🔨 🪛 🔧 -------------------------\n\n");
  
  await testDB();
  
  client.end();
}

rebuildDB();