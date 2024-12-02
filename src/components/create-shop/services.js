import axios from "axios";

// Proper async function using await to return data
export const GET_SHOPS = async () => {
    try {
        const response = await axios.get('https://mocki.io/v1/211cda96-7917-4c2b-bdea-1ad611e76eec', {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching shops:", error);
        return []; 
    }
};
