import { addressService } from "../services/address.service.js";
import { success } from "./controllerHelper.js";
export const AddressController = {
    add: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const address = await addressService.addAddress(customerId, req.body);
            return success(res, address);
        }
        catch (err) {
            next(err);
        }
    },
    update: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const { id } = req.params;
            await addressService.updateAddress(customerId, id, req.body);
            return success(res, { success: true });
        }
        catch (err) {
            next(err);
        }
    },
    delete: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const { id } = req.params;
            await addressService.deleteAddress(customerId, id);
            return success(res, { success: true });
        }
        catch (err) {
            next(err);
        }
    },
    list: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const list = await addressService.listAddresses(customerId);
            return success(res, list);
        }
        catch (err) {
            next(err);
        }
    }
};
