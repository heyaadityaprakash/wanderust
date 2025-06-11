import express from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import Listing from '../models/listing.js';


import isLoggedIn from '../middleware.js';
const router = express.Router();

router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs', { allListings });
}));

router.get('/new', isLoggedIn,(req, res) => {
    res.render('./listings/new.ejs');
});

router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id).populate('reviews');
    res.render('./listings/show.ejs', { listings });
}));

router.post('/',isLoggedIn,  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    // flash message
    req.flash('success','new listing added successfully');
    res.redirect('/listings');
}));

router.get('/:id/edit',isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    req.flash('success', 'Changes saved !');
    
    res.render('./listings/edit.ejs', { listing });
}));

router.put('/:id',isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

router.delete('/:id',isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

// logout routes


router.get('/logout',(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err)
        }
        req.flash('success','Logged Out')
        res.redirect('/listings') 
    })
})


export default router;
