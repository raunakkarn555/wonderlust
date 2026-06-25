const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const geocoder = require("../utils/geocode.js");

main()
  .then(() => console.log("connected"))
  .catch(err => console.log(err));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");

  const allListings = await Listing.find({});

  for (let listing of allListings) {
    const coords = listing.geometry && listing.geometry.coordinates;
    const isInvalidCoords = !coords
      || coords.length === 0
      || (coords[0] === 0 && coords[1] === 0);

    if (isInvalidCoords) {
      try {
        const geoData = await geocoder.geocode(`${listing.location}, ${listing.country}`);

        listing.geometry = {
          type: "Point",
          coordinates: geoData.length
            ? [geoData[0].longitude, geoData[0].latitude]
            : [0, 0]
        };

        await listing.save();
        console.log(`Updated: ${listing.title} ->`, listing.geometry.coordinates);
      } catch (err) {
        console.log(`Failed to geocode: ${listing.title} ->`, err.message);
      }

      await sleep(1100); // wait just over 1 second before the next request
    }
  }

  console.log("Done updating all listings.");
  mongoose.disconnect();
}