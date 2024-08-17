const mongoose=require("mongoose")
const Schema=mongoose.Schema

const listingSchema=new Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },

    image:{
        type:String,
        default:"https://designtemplate.tech/thu-jan-12-2023-1-48-pm27429.webp",
        set: (v) => {
            // Return the default image if the value is an empty string
            return v === "" ? "https://designtemplate.tech/thu-jan-12-2023-1-48-pm27429.webp" : v;
        }
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
})

const listing=mongoose.model('listing',listingSchema)
module.exports=listing