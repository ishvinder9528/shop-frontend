import axios from "axios";

// Proper async function using await to return data
export const GET_SHOPS = async () => {
    try {
        const response = await axios.get('https://mocki.io/v1/20ecafad-a563-420d-aba5-4f0941aadc16', {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("response service:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching shops:", error);
        return []; 
    }
};
