const Campground = require("../models/campgrounds");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await maptilerClient.geocoding.forward(req.body.location, {
    limit: 1,
  });
  const campground = new Campground(req.body);
  campground.geometry = geoData.features[0].geometry;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  console.log(campground);
  await campground.save();
  req.flash("success", "Successfully made a new campground!!");
  res.redirect(`/campground/${campground._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById({ _id: id });
  if (!campground) {
    req.flash("error", "Cannot find that campground!!");
    return res.redirect("/campground");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate({ _id: id }, req.body);
  const geoData = await maptilerClient.geocoding.forward(req.body.location, {
    limit: 1,
  });
  campground.geometry = geoData.features[0].geometry;
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  req.flash("success", "Successfully updated campgrounds!!");
  res.redirect(`/campground/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete({ _id: id });
  req.flash("success", "Campgrounds Deleted!!");
  res.redirect("/campground");
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "cannot find the campground!!");
    return res.redirect("/campground");
  }
  res.render("campgrounds/show", { campground });
};
