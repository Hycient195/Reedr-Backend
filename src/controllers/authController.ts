import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const signup = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ data: { message: 'User already exists' } });
        }

        user = new User({
            username,
            email,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // 1 hour
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ data: {message: 'Invalid credentials'} });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ data: { message: 'Invalid credentials'} });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.cookie('token', token, {
            path: "/",
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // 1 hour
        });

        res.cookie("user", user, {
            path: "/",
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // 1 hour
        })

        res.status(200).json({ message: 'Login successful', user: { _id: user._id, username: user.username, email: user.email }});
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export { signup, login };