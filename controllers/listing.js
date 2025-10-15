const Listing = require("../models/listing");
const geocodeLocation = require('../utils/geocoding');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {
        allListings,
        currentFilter: null,
        currUser: req.user
    });
};

module.exports.filterByIcon = async (req, res) => {
    const { iconType } = req.params;
    const filteredListings = await Listing.find({ iconType });
    res.render("listings/index.ejs", {
        allListings: filteredListings,
        currentFilter: iconType,
        currUser: req.user
    });
};

module.exports.filter = async (req, res) => {
    const iconType = req.query.iconType;
    let filteredListings;

    if (iconType) {
        filteredListings = await Listing.find({ iconType });
    } else {
        filteredListings = await Listing.find({});
    }

    res.render("listings/index.ejs", {
        allListings: filteredListings,
        currentFilter: iconType,
        currUser: req.user
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    res.render("./listings/show.ejs", {
        listing,
        mapTilerKey: process.env.MAPTILER_API_KEY,
        currentFilter: null,
        currUser: req.user
    });
};

module.exports.createListing = async (req, res, next) => {
    try {
        const geometry = await geocodeLocation(req.body.listing.location);

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        if (req.file) {
            newListing.image = { url: req.file.path, filename: req.file.filename };
        }

        newListing.geometry = geometry;
        await newListing.save();

        req.flash("success", "Listing created successfully");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not create listing. Please check the location.");
        res.redirect("/listings/new");
    }
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
        await listing.save();
    }

    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
};
