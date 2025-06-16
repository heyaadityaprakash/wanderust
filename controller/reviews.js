import Listing from '../models/listing.js';
import Reviews from '../models/reviews.js';

export const addReview=async(req,res)=>{
    let listing= await Listing.findById(req.params.id)
    let newReview=new Reviews(req.body.review)
    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();
    req.flash('success','Review added successfully');
    res.redirect(`/listings/${listing._id}`)
    
}


export const deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params
    Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Reviews.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}

