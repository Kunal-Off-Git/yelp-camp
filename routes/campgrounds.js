const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Joi = require("joi");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const Campground = require("../models/campgrounds");
const campgroundController = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgroundController.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgroundController.createCampground)
  );

router.get("/new", isLoggedIn, campgroundController.renderNewForm);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundController.renderEditForm)
);

router
  .route("/:id")
  .get(catchAsync(campgroundController.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgroundController.editCampground)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundController.deleteCampground)
  );

module.exports = router;
