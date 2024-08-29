const express = require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {listingSchema}= require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js"); 



// const listingController = require("../controllers/listings.js");

const multer = require('multer');
const {storage} = require ("../cloudConfig.js");
const upload = multer({storage});

const validateListing = (req,res,next) => {
  console.log(req.body)
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
};




  //New Route
  router.get("/new",
    isLoggedIn,
    //  listingController.renderNewForm
    (req, res) => {
    if(!req.isAuthenticated()){
          req.flash("error","you must be logged-in to create listing");
          return res.redirect("/login");
      }
    res.render("listings/new.ejs");
  }
  );





router
    .route("/")
    .get(wrapAsync ( 
        // listingController.index
        async (req, res) => {
          const allListings = await Listing.find({});
          res.render("listings/index.ejs", { allListings });
        }
  ))

    .post(isLoggedIn,
      upload.single('listing[image]') ,
      validateListing,
      wrapAsync ( 
        // listingController.createListing
        async (req, res,next) => {
        let url = req.file.path;
        let filename = req.file.filename;
        let result = listingSchema.validate(req.body);
        // console.log(result);
        if(result.error){
          throw new ExpressError(400,result.error);
        }
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};
        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
      }
    ));



router.route("/:id")
      .get( wrapAsync ( 
          // listingController.showListing
          async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({
            path:"reviews",
            populate: {
              path: "author",
            },
        })
            .populate("owner");
        if(!listing){
          req.flash("error","That Listing does not exist!");
          res.redirect("/listings");
        }
        // console.log(listing);
        res.render("listings/show.ejs", { listing });
      }
      ))


      .put(isLoggedIn, 
        isOwner,
        upload.single('listing[image]') ,
        validateListing,
        wrapAsync ( 
          // listingController.updateListing
          async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        if(typeof req.file != "undefined" ){
          let url = req.file.path;
          let filename = req.file.filename;
          listing.image = {url,filename};
          await listing.save();
        }
       

        req.flash("success","Listing Updated!");
        res.redirect(`/listings/${id}`);
      }
    ))

    .delete(isLoggedIn,
      isOwner,
      wrapAsync ( 
        // listingController.destroyListing
        async (req, res) => {
      let { id } = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      // console.log(deletedListing);
      req.flash("success","Listing Deleted!");
      res.redirect("/listings");
    }
  ));





//Index Route 
// router.get("/",
//     wrapAsync ( 
//       // listingController.index
//       async (req, res) => {
//         const allListings = await Listing.find({});
//         res.render("listings/index.ejs", { allListings });
//       }
// ));
  

  
  //Show Route
//   router.get("/:id",
//     wrapAsync ( 
//       // listingController.showListing
//       async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id)
//         .populate({
//         path:"reviews",
//         populate: {
//           path: "author",
//         },
//     })
//         .populate("owner");
//     if(!listing){
//       req.flash("error","That Listing does not exist!");
//       res.redirect("/listings");
//     }
//     console.log(listing);
//     res.render("listings/show.ejs", { listing });
//   }
// ));
  
  //Create Route
  // router.post(
  //   "/", 
  //   isLoggedIn,
  //   validateListing,
  //   wrapAsync ( 
  //     // listingController.createListing
  //     async (req, res,next) => {
  //     let result = listingSchema.validate(req.body);
  //     // console.log(result);
  //     if(result.error){
  //       throw new ExpressError(400,result.error);
  //     }
  //     const newListing = new Listing(req.body.listing);
  //     newListing.owner = req.user._id;
  //     await newListing.save();
  //     req.flash("success","New Listing Created!");
  //     res.redirect("/listings");
  //   }
  // ));
  
  //Edit Route
  router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync ( 
      // listingController.renderEditForm
      async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","That Listing does not exist!");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  }
));
  
//   //Update Route
//   router.put("/:id",
//     isLoggedIn, 
//     isOwner,
//     validateListing,
//     wrapAsync ( 
//       // listingController.updateListing
//       async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     req.flash("success","Listing Updated!");
//     res.redirect(`/listings/${id}`);
//   }
// ));
  
  //Delete Route
//   router.delete("/:id",
//     isLoggedIn,
//     isOwner,
//     wrapAsync ( 
//       // listingController.destroyListing
//       async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     req.flash("success","Listing Deleted!");
//     res.redirect("/listings");
//   }
// ));


  module.exports = router ;