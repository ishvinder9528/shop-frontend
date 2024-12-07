import Shop from "../models/Shop.js";

export const GetShopDataService = async () => {
    try {
        const shops = await Shop.find({})
            .select('name location gst phone about')
            .sort({ createdAt: -1 });
        return shops;
    } catch (error) {
        throw new Error(`Error fetching shops: ${error.message}`);
    }
};

export const GetShopByIdService = async (id) => {
    try {
        const shop = await Shop.findById(id);
        if (!shop) throw new Error('Shop not found');
        return shop;
    } catch (error) {
        throw new Error(`Error fetching shop: ${error.message}`);
    }
};

export const CreateShopService = async (shopData) => {
    try {
        const shop = new Shop(shopData);
        await shop.save();
        return shop;
    } catch (error) {
        throw new Error(`Error creating shop: ${error.message}`);
    }
};

export const DeleteShopService = async (id) => {
    try {
        const shop = await Shop.findByIdAndDelete(id);
        if (!shop) throw new Error('Shop not found');
        return shop;
    } catch (error) {
        throw new Error(`Error deleting shop: ${error.message}`);
    }
};
