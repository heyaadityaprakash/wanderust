import mongoose from "mongoose";
import Reviews from "./reviews.js";
import User from "./user.js";
const { Schema } = mongoose;

const listingSchema=new Schema({
    title:{type:String},
    description:String,
    image:{
        url:String,
        filename:String
        
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Reviews"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    coordinates: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
})


// to delete the reviews when the lisitng is deleted we will use post Schema of mongodb
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Reviews.deleteMany({_id:{$in:listing.reviews}})

    }
})



const Listing=mongoose.model("Listing",listingSchema)
export default Listing;