import axios from "axios";

const API_URL = import.meta.env.VITE_HOST;

export const createOrUpdateUser = async (userData) => {
    try {
        console.log("userData by google service: ",userData);
        
        const { _id, ...userDataWithoutId } = userData;
        
        console.log('Sending user data to backend:', userDataWithoutId);
        
        const response = await axios.post(`${API_URL}/users`, userDataWithoutId);
        const { user, token } = response.data;
        
        // Store token
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return user;
    } catch (error) {
        console.error("Error creating/updating user:", error.response?.data || error);
        throw error;
    }
};

// Add axios interceptor to include token in all requests
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getUser = async (googleId) => {
    try {
        const response = await axios.get(`${API_URL}/users/${googleId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

export const updateUser = async (googleId, userData) => {
    try {
        const response = await axios.put(`${API_URL}/users/${googleId}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const deleteUser = async (googleId) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${googleId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}; 