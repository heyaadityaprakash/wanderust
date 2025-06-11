 const isLoggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
        req.flash('error','you must be logged in to create a listing');
        return res.redirect('/login')
    }
    next()
}
export default isLoggedIn