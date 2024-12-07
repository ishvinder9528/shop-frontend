import axios from 'axios';

const API_URL = import.meta.env.VITE_HOST;

export const getLedgerEntries = async (filters = {}) => {
    try {
        const response = await axios.get(`${API_URL}/ledger`, { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching ledger entries:', error);
        throw error;
    }
};

export const createLedgerEntry = async (entryData) => {
    try {
        const response = await axios.post(`${API_URL}/ledger`, entryData);
        return response.data;
    } catch (error) {
        console.error('Error creating ledger entry:', error);
        throw error;
    }
};

export const updateLedgerEntry = async (entryId, updateData) => {
    try {
        const response = await axios.put(`${API_URL}/ledger/${entryId}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error updating ledger entry:', error);
        throw error;
    }
};

export const deleteLedgerEntry = async (entryId) => {
    try {
        const response = await axios.delete(`${API_URL}/ledger/${entryId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting ledger entry:', error);
        throw error;
    }
};

export const getLedgerSummary = async (filters = {}) => {
    try {
        const response = await axios.get(`${API_URL}/ledger/summary`, { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching ledger summary:', error);
        throw error;
    }
};