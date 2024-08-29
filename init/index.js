// const mongoose = require("mongoose");
// const initData = require("../data.js");
// const Listing = require("../models/listing.js");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => { 
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//   await Listing.deleteMany({});
//   // initData.data = initData.data.map((obj) => ({...obj, owner: '66cb78d548728bc1e15338dd'}));
//   // initData.data = initData.data.map((obj) => ({...obj, owner: '66cb8b686e9bafd4db52ed72'}));
//   // initData.data = initData.data.map((obj) => ({...obj, owner: '66cb78d548728bc1e15338dd'}));
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB();


const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj,owner: '66cc1af07d27dcc83256c59e'}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
}catch(error) {
  console.error(error);
  throw new Error(error);
}

};

initDB();
