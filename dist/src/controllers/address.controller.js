import { addressService } from "../services/address.service.js";
export const AddressController = {
    add: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const address = await addressService.addAddress(customerId, req.body);
            res.json(address);
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
            res.json({ success: true });
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
            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    },
    list: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const list = await addressService.listAddresses(customerId);
            res.json(list);
        }
        catch (err) {
            next(err);
        }
    }
};
