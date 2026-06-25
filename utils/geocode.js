const NodeGeocoder = require("node-geocoder");

const options = {
    provider: "openstreetmap",   // tells node-geocoder to use OSM's Nominatim service
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;