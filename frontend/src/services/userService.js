import axios from "axios";

const API_URL = import.meta.env.VITE_HOST;

export const createOrUpdateUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users`, userData);
        return response.data;
    } catch (error) {
        console.error("Error creating/updating user:", error);
        throw error;
    }
};

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