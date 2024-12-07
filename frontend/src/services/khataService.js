import axios from 'axios';

const API_URL = import.meta.env.VITE_HOST;

export const createKhataEntry = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/khata`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getKhataEntries = async () => {
    try {
        const response = await axios.get(`${API_URL}/khata`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateKhataPayment = async (entryId, paymentData) => {
    try {
        const response = await axios.put(`${API_URL}/khata/${entryId}/payment`, paymentData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteKhataEntry = async (entryId) => {
    try {
        const response = await axios.delete(`${API_URL}/khata/${entryId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getKhataSummary = async () => {
    try {
        const response = await axios.get(`${API_URL}/khata/summary`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}; 