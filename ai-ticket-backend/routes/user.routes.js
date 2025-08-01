import express from 'express'
import { login, logout, signup, updateUser } from '../controllers/user.controllers.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('update-user', authenticate, updateUser);
router.get('/users', authenticate, getUsers);

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);




export default userRoute;