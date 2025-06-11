import express from 'express';
import  wrapAsync  from '../utils/wrapAsync.js';
import Listing from '../models/listing.js';
import Reviews from '../models/reviews.js';


const router= express.Router({mergeParams:true});
//posting a review
router.post('/',wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id)
    let newReview=new Reviews(req.body.review)
    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();
    req.flash('success','Review added successfully');
    res.redirect(`/listings/${listing._id}`)
    
}))

// delete review

router.delete('/:reviewId',wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params
    Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Reviews.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))


export default router;