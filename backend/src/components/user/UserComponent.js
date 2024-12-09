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
        console.log('Received user data:', req.body);
        const { user, token } = await CreateUserService(req.body);
        res.status(201).json({ user, token });
    } catch (error) {
        logger.error('Error creating user:', { 
            error: error.message,
            body: req.body 
        });
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
