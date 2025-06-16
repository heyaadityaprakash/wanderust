import express from 'express';
import mongoose from 'mongoose';

import MongoStore from 'connect-mongo';

import path from 'path';
import methodoverride from 'method-override';
import ejsmate from 'ejs-mate';
import session, { Cookie } from 'express-session';

import listingRoutes from './routes/listingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoutes.js';

import flash from 'connect-flash';

import passport from 'passport';
import localStrategy from 'passport-local';
import User from './models/user.js'


// remove this while deployment
import 'dotenv/config';

const app=express()
app.set('view engine','ejs');
app.set('views',path.join(path.resolve(), 'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(path.resolve(), 'public')));



// const MONGO_URI='mongodb://127.0.0.1:27017/wanderlust';
const MONGO_URI=process.env.ATLASDB_URL

async function main() {
    await mongoose.connect(MONGO_URI)
    
}
main().then(()=>{
    console.log('connected to DB');
    
})
.catch((err)=>{
    console.log(err);
    
})


app.listen((8000),()=>{
    console.log('listening to port 8000');
    
})



// sessions
const store=MongoStore.create({
    mongoUrl:MONGO_URI,
    crypto:{
        secret:'testsecret',
        
    },
    touchAfter:24*60*60*1000
})


const sessionOptions={
    store:store,
    secret:'testsecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000 ,
        maxAge:7*24*60*60*1000, // 7 days,
        httpOnly:true
    }
}



app.use(session(sessionOptions))
app.use(flash())

//after session we will implement passport so that it does not ask for login again and again
app.use(passport.initialize());

app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    res.locals.currentUser=req.user
    next()
})

app.get('/',(req,res)=>{
    res.send('Hello World');
})



// app.get('/demo',async(req,res)=>{
//     let demoUser=new User({
//         email:'name@email.com',
//         username:'brucewayne'
//     })

//     let registeredUser=await User.register(demoUser,'abcdef')
//     res.send(registeredUser)
// })

app.use('/listings',listingRoutes)
app.use('/listings/:id/reviews',reviewRoutes)
app.use('/',userRoutes) 

















// app.all('*', (req, res, next) => {
//     next(new ExpressError(404, 'Page Not Found'));
// });

app.use((err, req, res, next) => {
    const { statuscode = 500, message = 'Something went wrong!' } = err;
     res.render('error.ejs',{message})
    // res.status(statuscode).send(message);
});

// task -> to handle validations