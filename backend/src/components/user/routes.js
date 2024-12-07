import express from 'express';
import { CreateUserCntrl, DeleteUserCntrl, GetUserCntrl, UpdateUserCntrl, LoginUserCntrl } from './UserComponent.js';

const router = express.Router();

router.get('/:googleId', GetUserCntrl);
router.post('/', CreateUserCntrl);
router.put('/:googleId', UpdateUserCntrl);
router.delete('/:googleId', DeleteUserCntrl);
router.post('/login', LoginUserCntrl);

export default router; 