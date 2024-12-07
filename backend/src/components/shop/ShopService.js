import Shop from "../../models/Shop.js";

export const GetShopDataService = async (userId) => {
    try {
        const shops = await Shop.find({ user: userId });
        return shops;
    } catch (error) {
        throw new Error(`Error fetching shops: ${error.message}`);
    }
};

export const GetShopByIdService = async (shopId, userId) => {
    try {
        const shop = await Shop.findOne({ _id: shopId, user: userId });
        if (!shop) {
            throw new Error('Shop not found');
        }
        return shop;
    } catch (error) {
        throw new Error(`Error fetching shop: ${error.message}`);
    }
};

export const CreateShopService = async (shopData, userId) => {
    try {
        const shop = new Shop({
            ...shopData,
            user: userId
        });
        await shop.save();
        return shop;
    } catch (error) {
        throw new Error(`Error creating shop: ${error.message}`);
    }
};

export const DeleteShopService = async (shopId, userId) => {
    try {
        const shop = await Shop.findOneAndDelete({ _id: shopId, user: userId });
        if (!shop) {
            throw new Error('Shop not found');
        }
        return shop;
    } catch (error) {
        throw new Error(`Error deleting shop: ${error.message}`);
    }
};
