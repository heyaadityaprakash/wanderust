import express from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { addListing, deleteListing, editListing, index, newListing, showListing, updateListing } from '../controller/listing.js';
import {isLoggedIn} from '../middleware.js';
import 'dotenv/config';
import multer from 'multer';

import { storage } from '../cloudconfig.js';
const router = express.Router();

// set the dest to be storage 
const upload=multer({storage})


router.get('/', wrapAsync(index));
router.get('/new',newListing);
router.get('/:id', wrapAsync(showListing));
router.post('/',upload.single('listing[image]'),isLoggedIn, wrapAsync(addListing));



router.get('/:id/edit',isLoggedIn, wrapAsync(editListing));
router.put('/:id',isLoggedIn,upload.single('image'), wrapAsync(updateListing));
router.delete('/:id',isLoggedIn, wrapAsync(deleteListing));

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
