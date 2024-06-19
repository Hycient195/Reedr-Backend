import { Router } from 'express';
import { signup, login } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/signin', login);

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ msg: 'Logout successful' });
});

export default router;