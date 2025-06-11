import mongoose from "mongoose";
import Reviews from "./reviews.js";
const { Schema } = mongoose;

const listingSchema=new Schema({
    title:{type:String},
    description:String,
    image:{type:String,
        default:"https://young.downtoearth.org.in/static/assets/img/Default_Image_Thumbnail.png",
        set:(val)=> val===""?"https://young.downtoearth.org.in/static/assets/img/Default_Image_Thumbnail.png":val
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Reviews"
        }
    ]
})


// to delete the reviews when the lisitng is deleted we will use post Schema of mongodb
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Reviews.deleteMany({_id:{$in:listing.reviews}})

    }
})



const Listing=mongoose.model("Listing",listingSchema)
export default Listing;