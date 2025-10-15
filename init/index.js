const mongoose = require('mongoose');
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
const MONGO_URL='mongodb://127.0.0.1:27017/Wanderbnb';

async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
.then((res)=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));
const initDB=async ()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj, owner:"68eb1e9dc552319689b444c9"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initalized");
};
initDB();