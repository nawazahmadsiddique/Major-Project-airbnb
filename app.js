if(process.env.NODE_ENV !="production"){
require("dotenv").config();
}


const dns=require("dns");
dns.setServers(['8.8.8.8' ,'8.8.4.4' ])

const express=require("express");
const mongoose=require("mongoose");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const ejsMate =require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport= require("passport");
const LocalStrategy=require("passport-local");
const user=require("./model/user.js");





const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlist";

const dbUrl=process.env.ATLASDB_URL;


main()
.then(()=>{
    console.log("connect to db");
})
.catch((err)=>{
    console.log(err);
});

async function main() {

    await mongoose.connect(dbUrl);
    
}





app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store= MongoStore.create({
        mongoUrl:dbUrl,
        crypto:{
            secret:process.env.SECRET,
        },
        touchAfter: 24*3600,
    }
);

store.on("error",()=>{
    console.log("Error in session mongostore",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};








// app.get("/",(req,res)=>{
//     res.send("hi i am root");
// });




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new user({
//         email:"nawaz786@gmail.com",
//         username:"nawazahmad"
//     });

//     let registeredUser= await user.register(fakeUser,"hello");
//     res.send(registeredUser);
// })


app.use("/listings",listingRouter);

app.use("/listings/:id/reviews", reviewRouter);

app.use("/",userRouter);



// app.get("/testlisting", async(req,res)=>{
//     let sampletesting=new listing({
//         title:"My new Vila",
//         description:"by Search",
//         price:50000,
//         location:"catlogue,Goa",
//         country:"India",
//     })

//     await sampletesting.save();
//     console.log("sample saved");
//     res.send("successful Testting");
// });

app.all('/{*splat}', (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong!"}=err;
     
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080, ()=>{
    console.log("server is listening");
});
