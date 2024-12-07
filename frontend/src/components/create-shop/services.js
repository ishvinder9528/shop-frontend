import axios from "axios";

const API_URL = import.meta.env.VITE_HOST;

export const GET_SHOPS = async () => {
    try {
        console.log('Fetching from:', `${API_URL}/shops`);
        const response = await axios.get(`${API_URL}/shops`);
        console.log('Response:', response);
        return response.data;
    } catch (error) {
        console.error("Error fetching shops:", error.response || error);
        return [];
    }
};

export const GET_SHOP = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/shops/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching shop:", error);
        return null;
    }
};

export const CREATE_SHOP = async (shopData) => {
    try {
        const response = await axios.post(`${API_URL}/shops`, shopData);
        return response.data;
    } catch (error) {
        console.error("Error creating shop:", error);
        throw error;
    }
};

export const DELETE_SHOP = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/shops/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting shop:", error);
        throw error;
    }
};
