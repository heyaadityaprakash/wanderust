import mongoose from "mongoose";
import sampleListings from "./data.js";
import Listing from "../models/listing.js";


const MONGO_URI='mongodb://127.0.0.1:27017/wanderlust';
async function main() {
    await mongoose.connect(MONGO_URI)
    
}
main().then(()=>{
    console.log('connected to DB');
    
})
.catch((err)=>{
    console.log(err);
    s
})


const initDB = async () => {
    try {
        await Listing.deleteMany({});
        // console.log(sampleListings);
        sampleListings.map((obj) => ({
         ...obj,
        owner: '684926922ac1882ebcec2cf3'
        }));
        console.log(sampleListings);
        
        await Listing.insertMany(sampleListings);
        console.log("Inserted data successfully");
    } catch (error) {
        console.error("Error inserting data:", error);
    }
}
initDB()