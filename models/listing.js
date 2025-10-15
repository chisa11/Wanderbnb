const mongoose=require("mongoose");
const Schema= mongoose.Schema;
const Review=require("./review.js");
const { string } = require("joi");

const listingschema=new Schema({
    title:{
      type:String,
      required:true
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
      type: Schema.Types.ObjectId,
      ref:"Review"
    },],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User"
    },
      geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
      iconType: { 
        type: String, 
        enum: ['Iconic cities','Mountains','Castle','Amazing pools','Camping', 'Desert', 'Beach', 'Lake', 'Dome','Farms','Nightlife','Rooms'], 
        default: 'Mountains',
        required: true
    } 
});
listingschema.post("findOneAndDelete",async(listing)=>{
   if (listing) {
    await Review.deleteMany({_id:{$in:listing.reviews}});
   }
});
const Listing=mongoose.model("listing",listingschema);
module.exports=Listing;