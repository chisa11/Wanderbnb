if (process.env.NODE_ENV !="production") {
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const expresserror=require("./utils/expresserror.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const dbUrl=process.env.ATLASDB_URL;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

async function main() {
  await mongoose.connect(dbUrl);
}
main()
.then((res)=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
      secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};
// ✅ Session setup
app.use(session(sessionOptions));
// ✅ Passport setup
app.use(passport.initialize());
app.use(passport.session());
// ✅ Flash setup
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.use((req,res,next)=>{
    next(new expresserror(404,"page not found"));
});

app.use((err,req,res,next)=>{
    let{statuscode=500,message="NHI CHLRA"}=err;
    res.status(statuscode);
    res.render("listings/error.ejs",{message});
});
app.listen(8080,()=>{
    console.log("app is listning on port 8080");
});