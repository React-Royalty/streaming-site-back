// db testing function imports
const { createUser, getUser, getUserById, getUserByUsername } = require("./users");
const { createMedia, updateMedia, getAllMedia, getMediaById, getMediaByTitle, deleteMedia, getAllMediaWithoutCategories, getMediaByIdWithCategories, getMediaByCategory } = require("./media");
const { createCategory, getAllCategories, attachCategoriesToMedia } = require("./categories");
const { addCategoryToMedia, deleteCategoryFromMedia, getAllMediaCategories, getMediaCategoryById, getMediaCategoriesByMediaId } = require("./media_categories");


// TODO: split these up into separate unit test functions
async function testDB() {
  console.log("\n\n\n------------------------------ ⚠️ 🧪 🧫 TESTING DATABASE ⚠️ 🧪 🧫 -------------------------------\n\n");


  // console.log("\n 💁‍ 😉 TESTING USERS 💁‍ 😉 \n");
  // console.log("createUser() ->");
  // console.log(await createUser({ username: "jenn", password: "pennsylvania"}));
  // console.log("getUser(right password) ->");
  // console.log(await getUser({ username: "taylor", password: "kingofmyheart" }));
  // console.log("getUser(wrong password) ->");
  // console.log(await getUser({ username: "taylor", password: "dontblameme" }));
  // console.log("getUser(wrong username) ->");
  // console.log(await getUser({ username: "nobody", password: "kingofmyheart" }));
  // console.log("getUserById(1) ->");
  // console.log(await getUserById(1));
  // console.log("getUserByUsername('madi')");
  // console.log(await getUserByUsername("madi"));


  console.log("\n📺 🎥 TESTING MEDIA 📺 🎥\n");
  // console.log("createMedia() ->");
  // console.log(await createMedia({ title: "Hawkeye", description: "Forence and Hailee??", image: "https://m.media-amazon.com/images/I/71t8z+AA-kL.jpg" }));
  // console.log("updateMedia(1) ->");
  // console.log(await updateMedia(1, { title: "I'VE BEEN CHANGED!!", description: "HERE I AM", image: "https://media.wonderlandmagazine.com/uploads/2014/11/Taylor-Swift-03-2.jpg" }));
  // console.log("deleteMedia(5) ->");
  console.log(await deleteMedia(5));
  console.log("getAllMedia() ->");
  console.log(await getAllMedia());
  // console.log("getAllMediaWithoutCategories() ->");
  // console.log(await getAllMediaWithoutCategories());
  console.log("getMediaById(19) ->");
  console.log(await getMediaById(19));
  console.log("getMediaByIdWithCategories(19) ->");
  console.log(await getMediaByIdWithCategories(19));
  // console.log("getMediaByTitle(Survivor) ->");
  // console.log(await getMediaByTitle("Survivor"));
  console.log("getMediaByCategory(2) ->");
  console.log(await getMediaByCategory(2));


  // console.log("\n🤠 👽 TESTING CATEGORIES 🤠 👽\n");
  // console.log("createCategory(horror) ->");
  // console.log(await createCategory({ name: "Horror" }));
  // console.log("getAllCategories() ->");
  // console.log(await getAllCategories());
  // console.log("attachCategoriesToMedia(all media) ->");
  // console.log(await attachCategoriesToMedia(await getAllMediaWithoutCategories()));


  // console.log("\n🦜 🐲 TESTING MEDIA CATEGORIES 🦜 🐲\n");
  // console.log("addCategoryToMedia(wandavision, show) ->");
  // console.log(await addCategoryToMedia({ mediaId: 22, categoryId: 2 }));
  // console.log("deleteCategoryFromMedia( ) ->");
  // console.log(await deleteCategoryFromMedia(1));
  // console.log("getAllMediaCategories() ->");
  // console.log(await getAllMediaCategories());
  // console.log("getMediaCategoryById(2) ->");
  // console.log(await getMediaCategoryById(2));
  // console.log("getMediaCategoriesByMediaId(19) ->");
  // console.log(await getMediaCategoriesByMediaId(19));


  console.log("\n\n--------------------------- ⚠️ 🧪 🧫 FINISHED TESTING DATABASE ⚠️ 🧪 🧫 ---------------------------\n\n");
}


module.exports = {
  testDB
}