const Listing = require("../models/listing");
const geocoder = require("../utils/geocode.js");

// index
module.exports.index = async (req, res) => {
    const { category, search } = req.query;
    let filter = {};

    if (category) {
        filter.category = category;
    }

    if (search && search.trim() !== "") {
        filter.$or = [
            { title:       { $regex: search.trim(), $options: "i" } },
            { location:    { $regex: search.trim(), $options: "i" } },
            { country:     { $regex: search.trim(), $options: "i" } },
        ];
    }

    const allListings = await Listing.find(filter).limit(9);
    const totalListings = await Listing.countDocuments(filter);

    res.render("listings/index.ejs", {
        allListings,
        currentCategory: category || null,
        totalListings,
        searchQuery: search || "",
    });
};

// new
module.exports.renderNewForm = (req, res) => {
       res.render('listings/new.ejs');
};

// listing
module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)   
    .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        }).populate("owner");
    if(!listing) {
        req.flash("error", "That Listing Not Found!");
        return res.redirect("/listings");
    }
    res.render('listings/show.ejs', {listing});
};


// new listing
module.exports.createListing = async (req, res, next) => {
    if (!req.file) {
        req.flash("error", "Please upload an image for the listing.");
        return res.redirect("/listings/new");
    }

let url = req.file.secure_url;
let filename = req.file.filename;

    const location = req.body.listing.location?.trim();
    const country = req.body.listing.country?.trim();

    const geoData = await geocoder.geocode(`${location}, ${country}`);

    if (!geoData.length) {
        req.flash("error", "We couldn't find that location. Please check the spelling and try again.");
        return res.redirect("/listings/new");
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = {
        type: "Point",
        coordinates: [geoData[0].longitude, geoData[0].latitude]
    };

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

// edit form listing
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "That Listing Not Found!");
        return res.redirect("/listings");
    }

    let originalImageUrl = (listing.image && listing.image.url)
        ? listing.image.url.replace("/upload", "/upload/c_fill,h_300,w_250")
        : null;

    res.render('listings/edit.ejs', { listing, originalImageUrl });
};

// update listing
module.exports.updateListing = async (req, res) => {
    let {id} = req.params;

    const location = req.body.listing.location?.trim();
    const country = req.body.listing.country?.trim();

    const geoData = await geocoder.geocode(`${location}, ${country}`);

    if (!geoData.length) {
        req.flash("error", "We couldn't find that location. Please check the spelling and try again.");
        return res.redirect(`/listings/${id}/edit`);
    }

    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    listing.geometry = {
        type: "Point",
        coordinates: [geoData[0].longitude, geoData[0].latitude]
    };

if (typeof req.file !== "undefined") {
    let url = req.file.secure_url;
    let filename = req.file.filename;
    listing.image = {url, filename};
}

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// delete listing
module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
};

// loadmore
module.exports.loadMore = async (req, res) => {
    const { category, skip, search } = req.query;
    let filter = {};

    if (category) {
        filter.category = category;
    }

    if (search && search.trim() !== "") {
        filter.$or = [
            { title:    { $regex: search.trim(), $options: "i" } },
            { location: { $regex: search.trim(), $options: "i" } },
            { country:  { $regex: search.trim(), $options: "i" } },
        ];
    }

    const listings = await Listing.find(filter).skip(Number(skip)).limit(9);
    const totalListings = await Listing.countDocuments(filter);
    res.json({ listings, totalListings });
};