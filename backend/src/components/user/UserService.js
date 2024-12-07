import User from "../../models/User.js";
import jwt from 'jsonwebtoken';

export const GetUserService = async (googleId) => {
    try {
        const user = await User.findOne({ googleId });
        return user;
    } catch (error) {
        throw new Error(`Error fetching user: ${error.message}`);
    }
};

export const CreateUserService = async (userData) => {
    try {
        // Remove _id if it exists in userData
        const { _id, ...userDataWithoutId } = userData;
        
        // Ensure required fields are present
        if (!userDataWithoutId.name || !userDataWithoutId.email || !userDataWithoutId.googleId) {
            throw new Error('Missing required fields: name, email, or googleId');
        }

        // Check if user exists by googleId
        let user = await User.findOne({ googleId: userDataWithoutId.googleId });
        
        if (user) {
            // Update existing user
            user = await User.findOneAndUpdate(
                { googleId: userDataWithoutId.googleId },
                { 
                    ...userDataWithoutId,
                    lastLogin: new Date()
                },
                { new: true }
            );
        } else {
            // Create new user
            const newUserData = {
                name: userDataWithoutId.name,
                email: userDataWithoutId.email,
                googleId: userDataWithoutId.googleId,
                picture: userDataWithoutId.picture,
                given_name: userDataWithoutId.given_name,
                family_name: userDataWithoutId.family_name,
                verified_email: userDataWithoutId.verified_email
            };
            
            user = new User(newUserData);
            await user.save();
        }

        // Generate token
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        
        return { user, token };
    } catch (error) {
        console.error('CreateUserService error:', error);
        throw new Error(`Error creating/updating user: ${error.message}`);
    }
};

export const UpdateUserService = async (googleId, updateData) => {
    try {
        const user = await User.findOneAndUpdate(
            { googleId },
            { ...updateData, lastLogin: Date.now() },
            { new: true }
        );
        if (!user) throw new Error('User not found');
        return user;
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
};

export const DeleteUserService = async (googleId) => {
    try {
        const user = await User.findOneAndDelete({ googleId });
        if (!user) throw new Error('User not found');
        return user;
    } catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
}; 

// ... existing imports ...

export const LoginUserService = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        if (!user.password) {
            throw new Error('Please login with Google');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        return user;
    } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
    }
};