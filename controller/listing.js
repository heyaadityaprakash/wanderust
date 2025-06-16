import Listing from '../models/listing.js';
import 'dotenv/config'
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js'
const maptoken=process.env.MAPBOX_TOKEN
// console.log(maptoken);


const geocodingCLient = mbxGeocoding({ accessToken: maptoken });



export const index=async(req,res)=>{
     const allListings = await Listing.find({});
    res.render('./listings/index.ejs', { allListings });
}

export const newListing=(req, res) => {
    res.render('./listings/new.ejs');
}

export const showListing=(async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id).populate('reviews').populate('owner')
    res.render('./listings/show.ejs', { listings });
    
})

export const addListing=async (req, res) => {
    console.log(req.body);
    
    let response=await geocodingCLient.forwardGeocode({

        query:req.body.listing.location,
        limit:1
    })
    .send()

    // console.log(response.body.features[0].geometry)
    let url=req.file.path
    let filename=req.file.filename
    const newListing = new Listing(req.body.listing);
    newListing.image={url,filename}

    newListing.coordinates=response.body.features[0].geometry
   
    await newListing.save();
    // flash message
    req.flash('success','new listing added successfully');
    res.redirect('/listings');
}

export const editListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    req.flash('success', 'Changes saved !');
    
    //showing a image preview
    let orgImg=listing.image.url
    orgImg=orgImg.replace('/upload','/upload/w_250')
    res.render('./listings/edit.ejs', { listing ,orgImg});
}

export const updateListing=async (req, res) => {
    let { id } = req.params;
    let listing =await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // adding images (check if already uploaded file? )
    if(typeof req.file!='undefined'){
        let url=req.file.path
        let filename=req.file.filename
        listing.image={url,filename}
        await listing.save();

    }
    
    res.redirect(`/listings/${id}`);
}

export const deleteListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}