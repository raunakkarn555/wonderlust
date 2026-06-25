const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require("../models/listing.js");


const Mongo_URL = "mongodb://127.0.0.1:27017/wonderlust";


main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect(Mongo_URL);
}

const initDb = async () => {
   try {
      await Listing.deleteMany({});
      const processedData = initData.data.map((obj) => ({
         ...obj, 
         image: {
            url: obj.image.url,
            filename: obj.image.filename || "listingimage"
         },
         owner: "6a3961026312b7157cff8f19"
      }));
      await Listing.insertMany(processedData);
      console.log("Database initialized with sample data");
   } catch (err) {
      console.error("Error initializing database:", err);
   }
};

initDb();