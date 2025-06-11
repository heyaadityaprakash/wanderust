import express from 'express';
const router = express.Router();
import User from '../models/user.js';
import passport from 'passport';
router.get('/signup',(req,res)=>{
   res.render('./users/signup.ejs');
})

router.post('/signup',async(req,res)=>{
   try{
      let {username,email,password}=req.body
      const newUser=new User({email,username})
      const regUser=await User.register(newUser,password)
       req.logIn(regUser,(err)=>{
         if(err){
            return next(err)

         }
          req.flash('success', 'Welcome to WanderLust!');
          res.redirect('/listings');
      })
     

   }
   catch(err){
      req.flash('error', err.message);
      res.redirect('/signup')
   }
   
})



router.get('/login',(req,res)=>{
   res.render('./users/login.ejs');
})

//authenticate the user while they login

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), async (req, res) => {
  res.redirect('/listings');
});

export default router;
