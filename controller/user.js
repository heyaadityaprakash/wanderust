import User from '../models/user.js';

export const signup=async(req,res)=>{
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
}


export const login=async (req, res) => {
  res.redirect(req.session.redirectUrl || '/listings')
}





export const renderSignup=(req,res)=>{
   res.render('./users/signup.ejs');
}

export const renderLogin=(req,res)=>{
   res.render('./users/login.ejs');
}


export const logout=async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash('success','logged out ')
        res.redirect('/listings')
    })
}