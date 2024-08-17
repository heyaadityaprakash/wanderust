const express=require("express")
const app=express()

const mongoose=require("mongoose")
const Listing=require("./models/listing.js")

const path=require("path")
const listing = require("./models/listing.js")

const ejsMate=require("ejs-mate");

const methodOverride=require("method-override")


const {listingSchema,reviewSchema}=require("./schema.js")

const Review=require("./models/review.js")


app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.urlencoded({extended:true}))

app.use(methodOverride("_method"))
app.engine('ejs',ejsMate)


//requiring wrapAsync
const wrapAsync=require("./utils/wrapAsync.js")
//requring expresserror
const ExpressError=require("./utils/ExoressError.js")


//function to validate(middleware)
const validateListing=(req,res,next)=>{

    let {eror}=listingSchema.validate(req.body)
    if(error){
        let errmsg=err.details.map((el)=> el.message).join(",")
        throw new ExpressError(404,errmsg)
    }
    else{
        next()
    }
    
}

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errmsg)
    }
    else{
        next()
    }

}

app.get("/",(req,res)=>{
    res.send("you are in root")
})

// using static files like images and css
app.use(express.static (path.join(__dirname,"/public")))

// creating database
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  }
  main().then(()=>{
    console.log("connected to db")
  })
  .catch((err)=>{
    console.log(err);
  })



// index route:

app.get("/listings",wrapAsync(async (req,res)=>{
    const alllistings=await Listing.find({})
    res.render("listings/index.ejs",{alllistings})
    
}))


// create and new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{

    // let listing=req.body.listing
    let result=listingSchema.validate(req.body)
    console.log(result    )
    const newListing= new Listing(req.body.listing)
    await newListing.save()
    res.redirect("/listings")

}))

// update and edit route

app.get("/listings/:id/edit",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params
    const listing=await Listing.findById(id)
    res.render("listings/edit.ejs",{listing})
}))

app.put("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
}))


// delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params
    let delListing=await Listing.findByIdAndDelete(id)
    console.log(delListing)
    res.redirect("/listings")

}))

// read /show route

app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params
    const listing=await Listing.findById(id).populate("reviews")
    res.render("listings/show.ejs",{listing})

}))



//reviews post route

app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
   let listing=await Listing.findById(req.params.id)
   let newReview=new Review(req.body.Review)

   listing.reviews.push(newReview)
   await newReview.save()
   await listing.save()

   res.redirect(`/listings/${listing._id}`)


}))


//delete reviews route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id, reviewId}=req.params

    await Listing.findByIdAndUpdate( id, {$pull :{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)

    res.redirect(`listings/${id}`)
}))


// app.get("/testListing", async (req, res) => {
//       let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//       });
    
//       await sampleListing.save();
//       console.log("sample was saved");
//       res.send("successful testing");
//     });


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"))
})

//custom error handler
app.use((err,req,res,next)=>{
    let {statuscode,message}=err

    res.status(statuscode).render("error.ejs",{message})
    // res.status(statuscode).send(message)
})




const port=8080
app.listen(port,()=>{
    console.log(`listening to port ${port}`)
})


