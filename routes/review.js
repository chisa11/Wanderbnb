const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const expresserror=require("../utils/expresserror.js");
// const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");
// //VALIDATE REVIEW
// const validateReview=(req,res,next)=>{
//     let {error}=reviewSchema.validate(req.body);
//     if(error){
//         let errmsg=error.details.map((el)=>el.message).join(",");
//         throw new expresserror(400,errmsg);
//     }else{
//         next();
//     }
// }

//REVIEWS
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
//DELETE REVIEW ROUTE
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;