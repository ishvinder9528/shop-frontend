import { GetShopDataService, GetShopByIdService, CreateShopService, DeleteShopService } from "./ShopService.js";
import logger from '../config/logger.js';

export const GetShopDataCntrl = async (req, res) => {
    try {
        const shops = await GetShopDataService();
        res.status(200).json(shops);
    } catch (error) {
        logger.error('Error fetching shops:', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error fetching shops', error: error.message });
    }
};

export const GetShopByIdCntrl =  async (req, res) => {
    try {
        const shop = await GetShopByIdService(req.params.id);
        res.status(200).json(shop);
    } catch (error) {
        res.status(error.message.includes('not found') ? 404 : 500)
           .json({ message: error.message });
    }
}

export const CreateShopCntrl = async (req, res) => {
    try {
        const shop = await CreateShopService(req.body);
        res.status(201).json(shop);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const DeleteShopCntrl =  async (req, res) => {
    try {
        const shop = await DeleteShopService(req.params.id);
        res.status(200).json({ message: 'Shop deleted successfully', shop });
    } catch (error) {
        res.status(error.message.includes('not found') ? 404 : 500)
           .json({ message: error.message });
    }
}


