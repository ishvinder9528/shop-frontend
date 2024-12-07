import { CreateUserService, DeleteUserService, GetUserService, UpdateUserService, LoginUserService } from "./UserService.js";
import logger from '../../config/logger.js';

export const GetUserCntrl = async (req, res) => {
    try {
        const user = await GetUserService(req.params.googleId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        logger.error('Error fetching user:', { error: error.message });
        res.status(500).json({ message: error.message });
    }
};

export const CreateUserCntrl = async (req, res) => {
    try {
        const existingUser = await GetUserService(req.body.googleId);
        if (existingUser) {
            const updatedUser = await UpdateUserService(req.body.googleId, {
                ...req.body,
                lastLogin: new Date()
            });
            return res.status(200).json(updatedUser);
        }

        // Create new user
        const userData = {
            name: req.body.name,
            email: req.body.email,
            picture: req.body.picture,
            googleId: req.body.googleId,
            given_name: req.body.given_name,
            family_name: req.body.family_name,
            verified_email: req.body.verified_email
        };

        const user = await CreateUserService(userData);
        res.status(201).json(user);
    } catch (error) {
        logger.error('Error creating user:', { error: error.message });
        res.status(400).json({ message: error.message });
    }
};

export const UpdateUserCntrl = async (req, res) => {
    try {
        const user = await UpdateUserService(req.params.googleId, req.body);
        res.status(200).json(user);
    } catch (error) {
        logger.error('Error updating user:', { error: error.message });
        res.status(400).json({ message: error.message });
    }
};

export const DeleteUserCntrl = async (req, res) => {
    try {
        await DeleteUserService(req.params.googleId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error('Error deleting user:', { error: error.message });
        res.status(400).json({ message: error.message });
    }
}; 



export const LoginUserCntrl = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await LoginUserService(email, password);
        logger.info('Login successful:', { user: user });
        res.status(200).json(user);
    } catch (error) {
        logger.error('Login error:', { error: error.message });
        res.status(401).json({ message: error.message });
    }
};