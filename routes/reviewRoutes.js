import express from 'express';
import  wrapAsync  from '../utils/wrapAsync.js';
import { addReview, deleteReview } from '../controller/reviews.js';


const router= express.Router({mergeParams:true});
//posting a review
router.post('/',wrapAsync(addReview))

// delete review

router.delete('/:reviewId',wrapAsync(deleteReview))


export default router;