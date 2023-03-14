// db seed functions

const { client } = require("./index");

// db function imports
const { createUser } = require("./users");
const { createMedia, getMediaByTitle } = require("./media");
const { createCategory } = require("./categories");
const { addCategoryToMedia } = require("./media_categories");
// db testing function imports
const { testDB } = require("./TESTS");
const { createPoster } = require("./posters");
const { addPosterToMedia } = require("./media_posters");


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

      CREATE TABLE posters (
        id SERIAL PRIMARY KEY,
        image VARCHAR(255) UNIQUE NOT NULL,
        wide BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE media_posters (
        id SERIAL PRIMARY KEY,
        "mediaId" INTEGER REFERENCES media(id),
        "posterId" INTEGER REFERENCES posters(id),
        UNIQUE ("mediaId", "posterId")
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
      DROP TABLE IF EXISTS media_posters;
      DROP TABLE IF EXISTS posters;
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
          { username: "madi", password: "kingofreact" },
          { username: "drew", password: "queenofreact" },
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
      { title: "The Hunger Games", description: "In a dystopian future, teens Katniss and Peeta are drafted for a televised event pitting young competitors against each other in a fight to the death.", image: "https://i.imgur.com/ab9LCxu.png" },
      { title: "Catching Fire", description: "After her triumph in the Hunger Games, Katniss Everdeen travels through the districts on a \"Victory Tour\" while a rebellion gathers steam around her.", image: "https://i.imgur.com/MsyAvz0.png" },
      { title: "Easy A", description: "When a lie about Olive's reputation transforms her from anonymous to infamous at her high school, she decides to embrace a provocative new persona.", image: "https://i.imgur.com/oJHf5Qw.png" },
      { title: "Brokeback Mountain", description: "Two sheepherders in 1963 Wyoming become involved in an increasingly passionate affair, but hiding the relationship from their wives proves agonizing.", image: "https://i.imgur.com/4Lrbr0i.png" },
      { title: "The Dark Knight", description: "Batman, Lieutenant Gordon and District Attorney Harvey Dent go up against the Jokeer, a criminal mastermind in ghoulish makeup terrorizing Gotham City.", image: "https://i.imgur.com/eo37Pif.png" },
      { title: "Sing 2", description: "Buster Moon and his musically gifted friends must persuade the reclusive rock star Clay Calloway to join them for the opening of their new show.", image: "https://i.imgur.com/OtObV9N.png" },
      { title: "Scott Pilgrim Vs. The World", description: "Dreamy delivery girl Ramona captures Scott Pilgrim's heart, but he must vanquish all seven of her evil exes in martial arts battles to win her love.", image: "https://i.imgur.com/d1xEDiH.png" },
      { title: "21 Jump Street", description: "Two rookie cops go from park duty to prom when they're given a big assignment: Bust a drug ring by going undercover as high school students.", image: "https://i.imgur.com/fPThVsa.png" },
      { title: "Forrest Gump", description: "A gentle, friendly man navigates through the major events of the 1960s and '70s while inspiring those around him with his perpetual optimism.", image: "https://i.imgur.com/vAxIO2n.png" },
      { title: "RV", description: "Climbing aboard their mammoth recreational vehicle for a cross-country trip to the Rockies, the Munro family prepares for the adventure of a lifetime.", image: "https://i.imgur.com/hoIgYcP.png" },
      { title: "Flushed Away", description: "Hang on for a madcap adventure deep in the bowels of Ratropolis when high-society rat Roddy is flushed down the toilet by Sid, a common sewer rat.", image: "https://i.imgur.com/N5U91kt.png" },
      { title: "Daddy Day Care", description: "After losing his job, a stay-at-home dad jumps at the chance to start a day care center, inviting new kids and all kinds of shenanigans into his home.", image: "https://i.imgur.com/apFHFV4.png" },
      { title: "Monster House", description: "A trio of friends set out to expose the terrors of a vacant neighborhood house, which appears to have a craving for people — and a life of its own.", image: "https://i.imgur.com/wz3HCah.png" },
      { title: "Morbius", description: "A biochemist with a rare blood disease in search of a cure injects himself with a dangerous serum that gives him super strength and a thirst for blood.", image: "https://i.imgur.com/m6TPCTw.png" },
      { title: "La La Land", description: "Career aspirations run up against bittersweet romance in modern-day Los Angeles, as two artists face a heartbreaking dilemma.", image: "https://i.imgur.com/vySTDu3.png" },
      { title: "Rocky", description: "Rocky is a small-time Philadelphia boxer going nowhere, until an unbelievable shot to fight the world heavyweight champion lights a fire inside him.", image: "https://i.imgur.com/JYdIUrR.png" },
      { title: "Grease", description: "Teen lovebirds-turned-classmates Sandy and Danny struggle to juggle lingering feelings, new friendships and more in this iconic ensemble movie-musical.", image: "https://i.imgur.com/QcHjEYa.png" },
      { title: "Taylor Swift Reputation Stadium Tour", description: "Taylor Swift takes the stage in Dallas for the reputation Statium Tour and celebrates a monumental night of music, memories and visual magic.", image: "https://i.imgur.com/2xUJFqP.png" },
      { title: "The Pink Panther", description: "Bumbling Inspector Clouseau must solve the murder of a world-famous soccer coach and catch the thief who stole his priceless diamond ring.", image: "https://i.imgur.com/nHXvmOs.png" },
      { title: "The Half Of It", description: "When smart but cash-strapped teen Ellie Chu agrees to write a love letter for a jock, she doesn't expect to become his friend — or fall for his crush.", image: "https://i.imgur.com/zXt6P2I.png" },
      { title: "Do Revenge", description: "A dethroned queen bee at a posh private high school strikes a secret deal with an unassuming new student to exact revenge on each other's enemies.", image: "https://i.imgur.com/rAC4XLB.png" },
      { title: "The Hangover", description: "A bachelor party in Las Vegas spins out of control when the groom goes missing and his three buddies can't remember the debauchery from the night before.", image: "https://i.imgur.com/yz3izqc.png" },
      { title: "Home", description: "When misfit alien Oh mistakenly sends a party invite to the entire galaxy, he goes on the run to avoid trouble and befriends spunky human girl Tip.", image: "https://i.imgur.com/JRJ7rxC.png" },
      { title: "Big Daddy", description: "Sonny, who's been slacking since law school, gets a crash course in personal responsibility when he suddenly finds himself taking care of a 5-year-old.", image: "https://i.imgur.com/6LAqrRY.png" },
      { title: "Glass Onion A Knives Out Mystery", description: "World-famous detective Benoit Blanc heads to Greece to peel back the layers of a mystery surrounding a tech billionaire and his eclectic crew of friends.", image: "https://i.imgur.com/rN4dcYc.png" },
      { title: "It", description: "As kids vanish throughout town, a group of outcasts must face their biggest fears — and a murderous, terrifying and seemingly invincible clown.", image: "https://i.imgur.com/jVwF1lZ.png" },
      { title: "Guillermo del Toro's Pinocchio", description: "Oscar-winning filmmaker Guillermo del Toro reinvents the classic story of a wooden puppet brought to life in this stunning stop-motion musical tale.", image: "https://i.imgur.com/1WcJuqI.png" },

      { title: "Stranger Things", description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.", image: "https://i.imgur.com/9vlSVXT.png" },
      { title: "Grey's Anatomy", description: "Guided by a skillful team of dedicated doctors, Meredith Grey and her fellow interns struggle with life-and-death decisions at Seattle Grace Hospital.", image: "https://i.imgur.com/pCuDV1I.png" },
      { title: "Survivor", description: "In this long-running reality competition series, players battle the elements and each other as they vie for $1 million and title of Sole Survivor.", image: "https://i.imgur.com/PBWC3yV.png" },
      { title: "Sex Education", description: "Insecure Otis has all the answers when it comes to sex advice, thanks to his therapist mom. So rebel Maeve proposes a school sex-therapy clinic.", image: "https://i.imgur.com/1sEz2BK.png" },
      { title: "Wednesday", description: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy.", image: "https://i.imgur.com/nWYJyXg.png" },
      { title: "Avatar The Last Airbender", description: "Siblings Katara and Sokka wake young Aang from a long hibernation and learn he's an Avatar, whose air-bending powers can defeat the evil Fire Nation.", image: "https://i.imgur.com/7Lf4lzY.png" },
      { title: "Derry Girls", description: "Amidst the political conflict of Northern Ireland in the 1990s, five spirited students contend with the universal challenges of being a teenager.", image: "https://i.imgur.com/VZLhgNU.png" },
      { title: "Orange Is The New Black", description: "When a past crime catches up with her, a privileged New Yorker ends up in a women's prison, where she quickly makes friends and foes.", image: "https://i.imgur.com/O63dBzT.png" },
      { title: "Santa Clarita Diet", description: "They're ordinary husband and wife relators until she undergoes a dramatic change that sends them down a road of death and destruction. In a good way.", image: "https://i.imgur.com/cNfJUIU.png" },
      { title: "The Queen's Gambit", description: "In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom while grappling with addiction.", image: "https://i.imgur.com/ELxGf3l.png" },
      { title: "Seinfeld", description: "The \"show about nothing\" is a sitcom landmark, with comic Jerry and his three sardonic friends finding laughs in both the mundane and the ridiculous.", image: "https://i.imgur.com/1RiKrkL.png" },
      { title: "The Amazing Race", description: "Teams of two travel around the world competing in challenges and conquering obstacles in the hopes of bringing home a $1 million prize.", image: "https://i.imgur.com/DW1qJj0.png" },
      { title: "Key And Peele", description: "Former \"MADtv\" cast members Keegan-Michael Key and Jordan Peele join forces for this self-titled sketch comedy series that pokes fun at pop culture.", image: "https://i.imgur.com/5rGEcXZ.png" },
      { title: "The Legend Of Korra", description: "An avatar who can control the elements fights to keep her city safe from the evil forces of both the physical and spiritual worlds.", image: "https://i.imgur.com/g2fEKMD.png" },
      { title: "How To Get Away With Murder", description: "Brilliant criminal defense attorney and law professor Annalise Keating, plus five of her students, become involved in a twisted murder case.", image: "https://i.imgur.com/iRI6so4.png" },
      { title: "Bojack Horseman", description: "Meet the most beloved sitcom horse of the '90s, 20 years later. He's a curmudgeon with a heart of...not quite gold...but something like gold.", image: "https://i.imgur.com/I1xCj30.png" },
      { title: "Grace And Frankie", description: "They're not friends, but when their husbands leave them for each other, proper Grace and eccentric Frankie begin to bond in this Emmy-nominated series.", image: "https://i.imgur.com/LnbVelQ.png" },
      { title: "The 100", description: "One hundred young exiles from a dying space station are sent to Earth 97 years after a nuclear apocalypse to test if the planet is now inhabitable.", image: "https://i.imgur.com/lDIRs03.png" },
      { title: "The Good Place", description: "Due to an error, self-absorbed Eleanor Shellstrop arrives at the Good Place after her death. Determined to stay, she tries to become a better person", image: "https://i.imgur.com/LLEXCcm.png" },

      ];
      const media = await Promise.all(mediaToCreate.map(createMedia));
      console.log("media:", media);
      console.log("... 🍿🎞️ MEDIA CREATED!");
  } catch (error) {
      console.error("Error creating initial media");
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
      "Movie",
      "TV Show",
      "Animation",
      "Madi's Favorites"
    ];

    const categories = await Promise.all(categoriesToCreate.map(createCategory));
    console.log("categories:", categories);
    console.log("📃🗂️ ...CATEGORIES CREATED!");
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
  console.log("\n👇⭐ CREATING INITIAL MEDIA CATEGORIES...");
  try {

    console.log("get by title: ", await getMediaByTitle("Survivor"));
    console.log("ID: ", await getMediaByTitle("Survivor").id);
    mediaCategoriesToCreate = [ // TODO: MAKE WORK
      { mediaId: await getMediaByTitle("Survivor").id, categoryId: 2 },
      { mediaId: await getMediaByTitle("Survivor").id, categoryId: 4 },
    ];

    mediaCategoriesToCreate = [ // TODO: GET RID OF HARD CODED IDS
      { mediaId: 16, categoryId: 1 },
      { mediaId: 16, categoryId: 4 },
      { mediaId: 28, categoryId: 2 },
      { mediaId: 28, categoryId: 4 },
    ];

    const mediaCategories = await Promise.all(mediaCategoriesToCreate.map(addCategoryToMedia));
    console.log("media categories:", mediaCategories);
    console.log("✅🎯 ... MEDIA CATEGORIES CREATED!");
  } catch (error) {
      console.error("Error creating initial media categories");
      throw error;
  }
}


/**
 ** Create Initial Posters
 * Creates initial posters for posters table in the database.
 * @see /db/posters/createPoster
 */
async function createInitialPosters() {
  console.log("\n🙈🙊 CREATING INITIAL POSTERS...");
  try {

    postersToCreate = [ // TODO: GET RID OF HARD CODING
      { image: "https://i.imgur.com/ab9LCxu.png", wide: true }, // hunger games og image
      { image: "https://i.imgur.com/feEJKof.jpg", wide: false },  // hunger games
      { image: "https://i.imgur.com/MsyAvz0.png", wide: true }, // catching fire og image
      { image: "https://i.imgur.com/Ol4fjmA.png", wide: false },  // catching fire
    ];

    const posters = await Promise.all(postersToCreate.map(createPoster));
    console.log("posters:", posters);
    console.log("🐵🙉  ...POSTERS CREATED!");
  } catch (error) {
      console.error("Error creating initial posters");
      throw error;
  }
}


/**
 ** Create Initial Media Posters
 * Attach initial posters to media
 * @see /db/media_posters/addPosterToMedia 
 */
async function createInitialMediaPosters() {
  console.log("\n🦖 🦕 CREATING INITIAL MEDIA POSTERS...");
  try {

    mediaPostersToCreate = [ // TODO: GET RID OF HARD CODED IDS
      { mediaId: 1, posterId: 1 },
      { mediaId: 1, posterId: 2 },
      { mediaId: 2, posterId: 3 },
      { mediaId: 2, posterId: 4 },
    ];

    const mediaPosters = await Promise.all(mediaPostersToCreate.map(addPosterToMedia));
    console.log("media posters:", mediaPosters);
    console.log("🐍 🦎 ... MEDIA POSTERS CREATED!");
  } catch (error) {
      console.error("Error creating initial media posters");
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
  await createInitialPosters();
  await createInitialMediaPosters();
  console.log("\n\n------------------------ 🔨 🪛 🔧 FINISHED REBUILDING DATABASE 🔨 🪛 🔧 -------------------------\n\n");
  
  // await testDB();
  
  client.end();
}

rebuildDB();