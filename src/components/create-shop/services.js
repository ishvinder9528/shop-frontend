import axios from "axios";

// Proper async function using await to return data
export const GET_SHOPS = async () => {
    try {
        const response = await axios.get('https://shops.free.beeceptor.com/shops', {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("response service:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching shops:", error);
        return []; 
    }
};
