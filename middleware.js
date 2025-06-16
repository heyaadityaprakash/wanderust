 export const isLoggedIn=(req,res,next)=>{    
    
     if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash('error','you must be logged in to create a listing');
        return res.redirect('/login')
    }
    next()
}

//middleware to save redirecrting url
export const savedUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next()
}




