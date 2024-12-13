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
        console.log("userDataWithoutId", userDataWithoutId)
        // Ensure required fields are present
        if (!userDataWithoutId.name || !userDataWithoutId.email) {
            throw new Error('Missing required fields: name, email');
        }
        let user = ''
        // Check if user exists by googleId
        let googleUser = await User.findOne({ googleId: userDataWithoutId.googleId });
        let emailUser = await User.findOne({ email: userDataWithoutId.email });
        if (googleUser) {
            // Update existing user
            user = googleUser;
        } else if (emailUser) {
            // Update existing user
            throw new Error('User already exists with this email');
        } else if (userDataWithoutId.googleId) {
            // Create new user
            const newUserData = {
                name: userDataWithoutId.name,
                email: userDataWithoutId.email,
                googleId: userDataWithoutId.googleId,
                picture: userDataWithoutId.picture,
                given_name: userDataWithoutId.given_name,
                family_name: userDataWithoutId.family_name,
                verified_email: userDataWithoutId.verified_email,
                token: userDataWithoutId.token
            };

            user = new User(newUserData);
            await user.save();
        } else {
            const newUserData = {
                name: userDataWithoutId.name,
                email: userDataWithoutId.email,
                googleId: null,
                picture: 'https://avatar.iran.liara.run/public/16',
                given_name: userDataWithoutId.given_name,
                family_name: userDataWithoutId.family_name,
                verified_email: false,
                token: userDataWithoutId.token ?? null
            }
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