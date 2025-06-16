import express from 'express';
const router = express.Router();
import passport from 'passport';

import {savedUrl} from '../middleware.js';
import { login, logout, renderLogin, renderSignup, signup } from '../controller/user.js';

router.get('/signup',(renderSignup))

router.post('/signup',(signup))

router.get('/login',(renderLogin))

//authenticate the user while they login

router.post('/login',savedUrl, passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), (login));

export default router;


router.get('/logout',(logout))