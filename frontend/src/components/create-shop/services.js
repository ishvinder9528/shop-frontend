import axios from "axios";

const API_URL = import.meta.env.VITE_HOST;
export const GET_SHOPS = async () => {
    try {
        const response = await axios.get(`${API_URL}/shops`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching shops:", error);
        return [];
    }
};
