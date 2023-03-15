// db seed functions

const { client } = require("./index");

// db function imports
const { createUser } = require("./users");
const { createMedia, getAllMediaWithoutExtra } = require("./media");
const { createPoster } = require("./posters");
const { createCategory, getAllCategories } = require("./categories");
const { addCategoryToMedia } = require("./media_categories");
// db testing function imports
const { testDB } = require("./TESTS");


/**
 ** Create Tables
 * Creates tables [users, media, posters, categories, media_categories] for database.
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
        description TEXT NOT NULL
      );

      CREATE TABLE posters (
        id SERIAL PRIMARY KEY,
        "mediaId" INTEGER REFERENCES media(id),
        image VARCHAR(255) UNIQUE NOT NULL,
        wide BOOLEAN DEFAULT FALSE
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
      DROP TABLE IF EXISTS posters;
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
  console.log("\n👤 🌏 CREATING INITIAL USERS ...");
  try {
      const usersToCreate = [
          { username: "madi", password: "kingofreact" },
          { username: "drew", password: "queenofreact" },
          { username: "parvati", password: "queenofsurvivor" },
          { username: "taylor", password: "kingofmyheart" },
      ];
      const users = await Promise.all(usersToCreate.map(createUser));
      console.log("users:", users);
      console.log("... USERS CREATED! 👥 🌏");
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
  console.log("\n🎬 🍿 CREATING INITIAL MEDIA ...");
  try {
    const mediaToCreate = [
      // movies
      { title: "Easy A", description: "When a lie about Olive's reputation transforms her from anonymous to infamous at her high school, she decides to embrace a provocative new persona." },
      { title: "Brokeback Mountain", description: "Two sheepherders in 1963 Wyoming become involved in an increasingly passionate affair, but hiding the relationship from their wives proves agonizing." },
      { title: "The Dark Knight", description: "Batman, Lieutenant Gordon and District Attorney Harvey Dent go up against the Jokeer, a criminal mastermind in ghoulish makeup terrorizing Gotham City." },
      { title: "Sing 2", description: "Buster Moon and his musically gifted friends must persuade the reclusive rock star Clay Calloway to join them for the opening of their new show." },
      { title: "Scott Pilgrim vs. the World", description: "Dreamy delivery girl Ramona captures Scott Pilgrim's heart, but he must vanquish all seven of her evil exes in martial arts battles to win her love." },
      { title: "Morbius", description: "A biochemist with a rare blood disease in search of a cure injects himself with a dangerous serum that gives him super strength and a thirst for blood." },
      { title: "La La Land", description: "Career aspirations run up against bittersweet romance in modern-day Los Angeles, as two artists face a heartbreaking dilemma." },
      { title: "Rocky", description: "Rocky is a small-time Philadelphia boxer going nowhere, until an unbelievable shot to fight the world heavyweight champion lights a fire inside him." },
      { title: "Grease", description: "Teen lovebirds-turned-classmates Sandy and Danny struggle to juggle lingering feelings, new friendships and more in this iconic ensemble movie-musical." },
      { title: "Taylor Swift Reputation Stadium Tour", description: "Taylor Swift takes the stage in Dallas for the reputation Statium Tour and celebrates a monumental night of music, memories and visual magic." },
      { title: "The Pink Panther", description: "Bumbling Inspector Clouseau must solve the murder of a world-famous soccer coach and catch the thief who stole his priceless diamond ring." },
      { title: "The Half of It", description: "When smart but cash-strapped teen Ellie Chu agrees to write a love letter for a jock, she doesn't expect to become his friend — or fall for his crush." },
      { title: "Do Revenge", description: "A dethroned queen bee at a posh private high school strikes a secret deal with an unassuming new student to exact revenge on each other's enemies." },
      { title: "It", description: "As kids vanish throughout town, a group of outcasts must face their biggest fears — and a murderous, terrifying and seemingly invincible clown." },
      { title: "Guillermo del Toro's Pinocchio", description: "Oscar-winning filmmaker Guillermo del Toro reinvents the classic story of a wooden puppet brought to life in this stunning stop-motion musical tale." },
      { title: "A Knight's Tale", description: "After a young squire finds a way to pass himself off as a bona fide knight, he becomes a jousting champion while romancing an admiring princess." },
      { title: "Portrait of a Lady on Fire", description: "On an isolated island in Brittany at the end of the eighteenth century, a female painter is obliged to paint a wedding portrait of a young woman." },
      { title: "Hunt for the Wilderpeople", description: "A boy (Julian Dennison) and his foster father (Sam Neill) become the subjects of a manhunt after they get stranded in the New Zealand wilderness." },
      { title: "Hereditary", description: "A grieving family is haunted by tragic and disturbing occurrences." },
      { title: "Knives Out", description: "A detective investigates the death of the patriarch of an eccentric, combative family." },

      // tv shows
      { title: "Stranger Things", description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl." },
      { title: "Grey's Anatomy", description: "Guided by a skillful team of dedicated doctors, Meredith Grey and her fellow interns struggle with life-and-death decisions at Seattle Grace Hospital." },
      { title: "Survivor", description: "In this long-running reality competition series, players battle the elements and each other as they vie for $1 million and title of Sole Survivor." },
      { title: "Wednesday", description: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy." },
      { title: "Avatar: The Last Airbender", description: "Siblings Katara and Sokka wake young Aang from a long hibernation and learn he's an Avatar, whose air-bending powers can defeat the evil Fire Nation." },
      { title: "Derry Girls", description: "Amidst the political conflict of Northern Ireland in the 1990s, five spirited students contend with the universal challenges of being a teenager." },
      { title: "Orange Is the New Black", description: "When a past crime catches up with her, a privileged New Yorker ends up in a women's prison, where she quickly makes friends and foes." },
      { title: "Santa Clarita Diet", description: "They're ordinary husband and wife relators until she undergoes a dramatic change that sends them down a road of death and destruction. In a good way." },
      { title: "The Queen's Gambit", description: "In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom while grappling with addiction." },
      { title: "Seinfeld", description: "The \"show about nothing\" is a sitcom landmark, with comic Jerry and his three sardonic friends finding laughs in both the mundane and the ridiculous." },
      { title: "The Amazing Race", description: "Teams of two travel around the world competing in challenges and conquering obstacles in the hopes of bringing home a $1 million prize." },
      { title: "The Legend of Korra", description: "An avatar who can control the elements fights to keep her city safe from the evil forces of both the physical and spiritual worlds." },
      { title: "How to Get Away with Murder", description: "Brilliant criminal defense attorney and law professor Annalise Keating, plus five of her students, become involved in a twisted murder case." },
      { title: "Bojack Horseman", description: "Meet the most beloved sitcom horse of the '90s, 20 years later. He's a curmudgeon with a heart of...not quite gold...but something like gold." },
      { title: "Grace and Frankie", description: "They're not friends, but when their husbands leave them for each other, proper Grace and eccentric Frankie begin to bond in this Emmy-nominated series." },
      { title: "The 100", description: "One hundred young exiles from a dying space station are sent to Earth 97 years after a nuclear apocalypse to test if the planet is now inhabitable." },
      { title: "The Good Place", description: "Due to an error, self-absorbed Eleanor Shellstrop arrives at the Good Place after her death. Determined to stay, she tries to become a better person" },
      { title: "Fleabag", description: "A comedy series adapted from the award-winning play about a young woman trying to cope with life in London whilst coming to terms with a recent tragedy." },
      { title: "Killing Eve", description: "After a series of events, the lives of a security operative and an assassin become inextricably linked." },
      { title: "Rick and Morty", description: "An animated series that follows the exploits of a super scientist and his not-so-bright grandson." },
      { title: "WandaVision", description: "A blend of classic television and the Marvel Cinematic Universe in which Wanda Maximoff (Elizabeth Olsen) and Vision (Paul Bettany) - two super-powered beings living idealized suburban lives - begin to suspect that everything is not as it seems." },
      { title: "The Vampire Diaries", description: "The lives, loves, dangers and disasters in the town, Mystic Falls, Virginia. Creatures of unspeakable horror lurk beneath this town as a teenage girl is suddenly torn between two vampire brothers." },
      { title: "Our Flag Means Death", description: "Based on a true story. The year is 1717. Wealthy land-owner Stede Bonnet has a midlife crisis and decides to blow up his cushy life to become a pirate." },
      { title: "Bluey", description: "Bluey follows the adventures of a lovable and inexhaustible six-year-old Blue Heeler puppy who lives with her dad, mum and four-year-old little sister, Bingo." },

      // { title: "", description: "" },
      ];
      const media = await Promise.all(mediaToCreate.map(createMedia));
      console.log("media:", media);
      console.log("... MEDIA CREATED! 🎬 🍿");
  } catch (error) {
      console.error("Error creating initial media");
      throw error;
  }
}


/**
 ** Create Initial Posters
 * Creates initial posters for posters table in the database.
 * @see /db/posters/createPoster
 */
async function createInitialPosters() {
  console.log("\n📸 🔥 CREATING INITIAL POSTERS ...");
  try {
    const mediaArray = await getAllMediaWithoutExtra();
    const mediaHash = {};
    mediaArray.forEach((media) => {
      mediaHash[media.title] = media;
    });

    const postersToCreate = [
      // movies
      { mediaId: mediaHash["Easy A"].id, image: "https://i.imgur.com/yJc2ZXC.png", wide: true },
      { mediaId: mediaHash["Easy A"].id, image: "https://i.imgur.com/WNZn1oJ.png", wide: false },
      { mediaId: mediaHash["Brokeback Mountain"].id, image: "https://i.imgur.com/RqGd0kL.png", wide: true },
      { mediaId: mediaHash["Brokeback Mountain"].id, image: "https://i.imgur.com/bOJCSdi.png", wide: false },
      { mediaId: mediaHash["The Dark Knight"].id, image: "https://i.imgur.com/8d83XKF.png", wide: true },
      { mediaId: mediaHash["The Dark Knight"].id, image: "https://i.imgur.com/DyQVU83.png", wide: false },
      { mediaId: mediaHash["Sing 2"].id, image: "https://i.imgur.com/B9ePRXj.png", wide: true },
      { mediaId: mediaHash["Sing 2"].id, image: "https://i.imgur.com/q5872YO.png", wide: false },
      { mediaId: mediaHash["Scott Pilgrim vs. the World"].id, image: "https://i.imgur.com/bdOi0c4.png", wide: true },
      { mediaId: mediaHash["Scott Pilgrim vs. the World"].id, image: "https://i.imgur.com/ZlMuUZO.png", wide: false },
      { mediaId: mediaHash["Morbius"].id, image: "https://i.imgur.com/HYpD7Hb.png", wide: true },
      { mediaId: mediaHash["Morbius"].id, image: "https://i.imgur.com/Ui68PNU.jpg", wide: false },
      { mediaId: mediaHash["La La Land"].id, image: "https://i.imgur.com/d58CKEH.png", wide: true },
      { mediaId: mediaHash["La La Land"].id, image: "https://i.imgur.com/lsDUfu7.png", wide: false },
      { mediaId: mediaHash["Rocky"].id, image: "https://i.imgur.com/15GCXW7.png", wide: true },
      { mediaId: mediaHash["Rocky"].id, image: "https://i.imgur.com/5BtkKAz.png", wide: false },
      { mediaId: mediaHash["Grease"].id, image: "https://i.imgur.com/QqJpXxP.png", wide: true },
      { mediaId: mediaHash["Grease"].id, image: "https://i.imgur.com/zD77MeA.png", wide: false },
      { mediaId: mediaHash["Taylor Swift Reputation Stadium Tour"].id, image: "https://i.imgur.com/iS89vIY.png", wide: true },
      { mediaId: mediaHash["Taylor Swift Reputation Stadium Tour"].id, image: "https://i.imgur.com/Wys5vHw.png", wide: false },
      { mediaId: mediaHash["The Pink Panther"].id, image: "https://i.imgur.com/Md4ycXa.png", wide: true },
      { mediaId: mediaHash["The Pink Panther"].id, image: "https://i.imgur.com/A33f2jD.png", wide: false },
      { mediaId: mediaHash["The Half of It"].id, image: "https://i.imgur.com/vvDAOFT.png", wide: true },
      { mediaId: mediaHash["The Half of It"].id, image: "https://i.imgur.com/TCcVejl.png", wide: false },
      { mediaId: mediaHash["Do Revenge"].id, image: "https://i.imgur.com/qJqjTiy.png", wide: true },
      { mediaId: mediaHash["Do Revenge"].id, image: "https://i.imgur.com/WIkhg5c.png", wide: false },
      { mediaId: mediaHash["It"].id, image: "https://i.imgur.com/b6xOJcO.png", wide: true },
      { mediaId: mediaHash["It"].id, image: "https://i.imgur.com/dXvgoDo.png", wide: false },
      { mediaId: mediaHash["Guillermo del Toro's Pinocchio"].id, image: "https://i.imgur.com/ILFGtmE.png", wide: true },
      { mediaId: mediaHash["Guillermo del Toro's Pinocchio"].id, image: "https://i.imgur.com/RFmUxpD.png", wide: true },
      { mediaId: mediaHash["Guillermo del Toro's Pinocchio"].id, image: "https://i.imgur.com/BxK0eCu.png", wide: false },
      { mediaId: mediaHash["A Knight's Tale"].id, image: "https://i.imgur.com/p0AMHhm.png", wide: true },
      { mediaId: mediaHash["A Knight's Tale"].id, image: "https://i.imgur.com/yXljDaC.png", wide: false },
      { mediaId: mediaHash["Portrait of a Lady on Fire"].id, image: "https://i.imgur.com/5Vx18SF.png", wide: true },
      { mediaId: mediaHash["Portrait of a Lady on Fire"].id, image: "https://i.imgur.com/oMargNB.png", wide: false },
      { mediaId: mediaHash["Hunt for the Wilderpeople"].id, image: "https://i.imgur.com/PAdrVks.png", wide: true },
      { mediaId: mediaHash["Hunt for the Wilderpeople"].id, image: "https://i.imgur.com/ESQtwau.png", wide: false },
      { mediaId: mediaHash["Hereditary"].id, image: "https://i.imgur.com/tGq82OI.png", wide: true },
      { mediaId: mediaHash["Hereditary"].id, image: "https://i.imgur.com/qx0t9Xw.png", wide: false },
      { mediaId: mediaHash["Knives Out"].id, image: "https://i.imgur.com/cWi621s.png", wide: true },
      { mediaId: mediaHash["Knives Out"].id, image: "https://i.imgur.com/FhWrjnJ.png", wide: false },

      // tv shows
      { mediaId: mediaHash["Stranger Things"].id, image: "https://i.imgur.com/WGoVaed.png", wide: true },
      { mediaId: mediaHash["Stranger Things"].id, image: "https://i.imgur.com/wwCVUGP.png", wide: true },
      { mediaId: mediaHash["Stranger Things"].id, image: "https://i.imgur.com/mXZ0zEW.png", wide: false },
      { mediaId: mediaHash["Grey's Anatomy"].id, image: "https://i.imgur.com/95pZTuK.png", wide: true },
      { mediaId: mediaHash["Grey's Anatomy"].id, image: "https://i.imgur.com/NUhAEdA.png", wide: false },
      { mediaId: mediaHash["Survivor"].id, image: "https://i.imgur.com/jpKOgzh.png", wide: true },
      { mediaId: mediaHash["Survivor"].id, image: "https://i.imgur.com/WZo1VmF.jpg", wide: false },
      { mediaId: mediaHash["Wednesday"].id, image: "https://i.imgur.com/Ndwn9XA.png", wide: true },
      { mediaId: mediaHash["Wednesday"].id, image: "https://i.imgur.com/4o2G2ho.png", wide: false },
      { mediaId: mediaHash["Avatar: The Last Airbender"].id, image: "https://i.imgur.com/CANAykD.png", wide: true },
      { mediaId: mediaHash["Avatar: The Last Airbender"].id, image: "https://i.imgur.com/UeDSb6h.png", wide: false },
      { mediaId: mediaHash["Derry Girls"].id, image: "https://i.imgur.com/AUqVhxn.png", wide: true },
      { mediaId: mediaHash["Derry Girls"].id, image: "https://i.imgur.com/ZqdFGJ1.png", wide: false },
      { mediaId: mediaHash["Orange Is the New Black"].id, image: "https://i.imgur.com/3GmU2KH.png", wide: true },
      { mediaId: mediaHash["Orange Is the New Black"].id, image: "https://i.imgur.com/dkNIQg7.png", wide: false },
      { mediaId: mediaHash["Santa Clarita Diet"].id, image: "https://i.imgur.com/QO00Re2.png", wide: true },
      { mediaId: mediaHash["Santa Clarita Diet"].id, image: "https://i.imgur.com/JikDE3m.png", wide: false },
      { mediaId: mediaHash["The Queen's Gambit"].id, image: "https://i.imgur.com/FNfDQ7r.png", wide: true },
      { mediaId: mediaHash["The Queen's Gambit"].id, image: "https://i.imgur.com/8JyCZR4.png", wide: false },
      { mediaId: mediaHash["Seinfeld"].id, image: "https://i.imgur.com/U0UPacJ.png", wide: true },
      { mediaId: mediaHash["Seinfeld"].id, image: "https://i.imgur.com/Je7jF92.png", wide: true },
      { mediaId: mediaHash["Seinfeld"].id, image: "https://i.imgur.com/e64qdmc.png", wide: false },
      { mediaId: mediaHash["The Amazing Race"].id, image: "https://i.imgur.com/sIj0Bsb.png", wide: true },
      { mediaId: mediaHash["The Amazing Race"].id, image: "https://i.imgur.com/WTilfVR.jpg", wide: false },
      { mediaId: mediaHash["The Legend of Korra"].id, image: "https://i.imgur.com/8x2hQVa.png", wide: true },
      { mediaId: mediaHash["The Legend of Korra"].id, image: "https://i.imgur.com/w7niYWD.png", wide: false },
      { mediaId: mediaHash["How to Get Away with Murder"].id, image: "https://i.imgur.com/Pj35ozc.png", wide: true },
      { mediaId: mediaHash["How to Get Away with Murder"].id, image: "https://i.imgur.com/XHnKiyp.png", wide: false },
      { mediaId: mediaHash["Bojack Horseman"].id, image: "https://i.imgur.com/zfvDVth.png", wide: true },
      { mediaId: mediaHash["Bojack Horseman"].id, image: "https://i.imgur.com/5RGMxJG.png", wide: false },
      { mediaId: mediaHash["Grace and Frankie"].id, image: "https://i.imgur.com/cjntWpz.png", wide: true },
      { mediaId: mediaHash["Grace and Frankie"].id, image: "https://i.imgur.com/JC6B3Dq.png", wide: false },
      { mediaId: mediaHash["The 100"].id, image: "https://i.imgur.com/SOUG7Xc.png", wide: true },
      { mediaId: mediaHash["The 100"].id, image: "https://i.imgur.com/id7qJlV.png", wide: false },
      { mediaId: mediaHash["The Good Place"].id, image: "https://i.imgur.com/5Kz9mna.png", wide: true },
      { mediaId: mediaHash["The Good Place"].id, image: "https://i.imgur.com/NdoPoPf.png", wide: false },
      { mediaId: mediaHash["Fleabag"].id, image: "https://i.imgur.com/kwjmWaP.png", wide: true },
      { mediaId: mediaHash["Fleabag"].id, image: "https://i.imgur.com/vW7Jckh.png", wide: false },
      { mediaId: mediaHash["Killing Eve"].id, image: "https://i.imgur.com/N6lPPEP.png", wide: true },
      { mediaId: mediaHash["Killing Eve"].id, image: "https://i.imgur.com/yQcLnnq.png", wide: false },
      { mediaId: mediaHash["Killing Eve"].id, image: "https://i.imgur.com/JUCM1CI.png", wide: false },
      { mediaId: mediaHash["Rick and Morty"].id, image: "https://i.imgur.com/hlcvJh0.png", wide: true },
      { mediaId: mediaHash["Rick and Morty"].id, image: "https://i.imgur.com/cgnBmjM.png", wide: false },
      { mediaId: mediaHash["WandaVision"].id, image: "https://i.imgur.com/pyrzS27.png", wide: true },
      { mediaId: mediaHash["WandaVision"].id, image: "https://i.imgur.com/ehleiGu.png", wide: false },
      { mediaId: mediaHash["The Vampire Diaries"].id, image: "https://i.imgur.com/8T42uuc.png", wide: true },
      { mediaId: mediaHash["The Vampire Diaries"].id, image: "https://i.imgur.com/NPGtY16.png", wide: false },
      { mediaId: mediaHash["Our Flag Means Death"].id, image: "https://i.imgur.com/L8DucKv.png", wide: true },
      { mediaId: mediaHash["Our Flag Means Death"].id, image: "https://i.imgur.com/0tEjrnV.jpg", wide: false },
      { mediaId: mediaHash["Bluey"].id, image: "https://i.imgur.com/OtKRv0t.png", wide: true },
      { mediaId: mediaHash["Bluey"].id, image: "https://i.imgur.com/d49MhAj.png", wide: false },


      // { mediaId: mediaHash[""].id, image: "", wide: true },
      // { mediaId: mediaHash[""].id, image: "", wide: false },

    ];

    const posters = await Promise.all(postersToCreate.map(createPoster));
    console.log("posters:", posters);
    console.log("... POSTERS CREATED! 📸 🔥");
  } catch (error) {
      console.error("Error creating initial posters");
      throw error;
  }
}


/**
 ** Create Initial Categories
 * Creates initial categories for categories table in the database.
 * @see /db/categories/createCategory 
 */
async function createInitialCategories() {
  console.log("\n🧠 👽 CREATING INITIAL CATEGORIES ...");
  try {
    const categoriesToCreate = [
      "Movie",
      "TV Show",
      "Animation",
      "Madi's Favorites"
    ];

    const categories = await Promise.all(categoriesToCreate.map(createCategory));
    console.log("categories:", categories);
    console.log("... CATEGORIES CREATED! 🧠 👽");
  } catch (error) {
      console.error("Error creating initital categories");
      throw error;
  }
}


/**
 ** Create Initial Media Categories
 * Attach initial categories to media
 * @see /db/media_categories/addCategoryToMedia 
 */
async function createInitialMediaCategories() {
  console.log("\n ⚠️  📁 CREATING INITIAL MEDIA CATEGORIES...");
  try {
    const [ movie, show, animation, madi ] = await getAllCategories();

    const mediaArray = await getAllMediaWithoutExtra();
    const mediaHash = {};
    mediaArray.forEach((media) => {
      mediaHash[media.title] = media;
    });

    const mediaCategoriesToCreate = [
      { mediaId: mediaHash["Taylor Swift Reputation Stadium Tour"].id, categoryId: movie.id },
      { mediaId: mediaHash["Taylor Swift Reputation Stadium Tour"].id, categoryId: madi.id },
      { mediaId:  mediaHash["Survivor"].id, categoryId: show.id },
      { mediaId:  mediaHash["Survivor"].id, categoryId: madi.id },
    ];

    const mediaCategories = await Promise.all(mediaCategoriesToCreate.map(addCategoryToMedia));
    console.log("media categories:", mediaCategories);
    console.log("... MEDIA CATEGORIES CREATED! ⚠️  📁");
  } catch (error) {
      console.error("Error creating initial media categories");
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
  await createInitialPosters();
  await createInitialCategories();
  await createInitialMediaCategories();
  console.log("\n\n------------------------ 🔨 🪛 🔧 FINISHED REBUILDING DATABASE 🔨 🪛 🔧 -------------------------\n\n");
  
  // await testDB();
  
  client.end();
}

rebuildDB();