import User from "../../models/User.js";

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
        const { id, ...userDataWithoutId } = userData;
        
        const user = new User(userDataWithoutId);
        await user.save();
        return user;
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
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