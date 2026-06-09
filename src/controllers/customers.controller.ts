import type { Request  } from "express";
import { customerService } from "../services/customers.service.ts";
import { ordersService } from "../services/orders.service.ts";
import { wrap, fail } from "../contracts/api.js";

export const CustomersController = {
  register: wrap(async (req: Request) => {
    const { name, email, password, phone } = req.body ?? {};
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      throw fail("INVALID_INPUT", "Name, email and password are required");
    }
    const result = await customerService.register({ name, email, password, phone });
    if (!result) throw fail("CONFLICT", "An account with this email already exists");
    return result;
  }),

  login: wrap(async (req: Request) => {
    const { email, password } = req.body;
    const tokens = await customerService.login(email, password);
    if (!tokens) throw fail('UNAUTHORIZED', 'Invalid credentials');
    return tokens;
  }),

  refresh: wrap(async (req: Request) => {
    const { refreshToken } = req.body;
    const tokens = await customerService.refresh(refreshToken);
    if (!tokens) throw fail('FORBIDDEN', 'Invalid token');
    return tokens;
  }),

  profile: wrap(async (req: Request) => {
    const customerId = req.user?.id;
    if (!customerId) throw fail('UNAUTHORIZED', 'Unauthorized');
    const profile = await customerService.getProfile(customerId);
    if (!profile) throw fail('NOT_FOUND', 'Customer not found');
    return profile;
  }),

  addAddress: wrap(async (req: Request) => {
    const customerId = req.user?.id;
    if (!customerId) throw fail('UNAUTHORIZED', 'Unauthorized');
    const address = await customerService.addAddress(customerId, req.body);
    return address;
  }),

  updateAddress: wrap(async (req: Request) => {
    const customerId = req.user?.id;
    const addressId = req.params.id;
    if (!customerId) throw fail('UNAUTHORIZED', 'Unauthorized');
    await customerService.updateAddress(customerId, addressId, req.body);
    return { success: true };
  }),

  listAddresses: wrap(async (req: Request) => {
    const customerId = req.user?.id;
    if (!customerId) throw fail('UNAUTHORIZED', 'Unauthorized');
    const addresses = await customerService.listAddresses(customerId);
    return addresses;
  }),

  getAddress: wrap(async (req: Request) => {
    const customerId = req.user?.id;
    const addressId = req.params.id;
    if (!customerId) throw fail('UNAUTHORIZED', 'Unauthorized');
    const address = await customerService.getAddress(customerId, addressId);
    if (!address) throw fail('NOT_FOUND', 'Address not found');
    return address;
  }),

  deleteAddress: wrap(async (req: Request) => {
    const customerId = req.user?.id;
    const addressId = req.params.id;
    if (!customerId) throw fail('UNAUTHORIZED', 'Unauthorized');
    await customerService.deleteAddress(customerId, addressId);
    return { success: true };
  }),

  updatePhone: wrap(async (req: Request) => {
    const customerId = req.user?.id;
    const { phoneNumber } = req.body;
    if (!customerId) throw fail('UNAUTHORIZED', 'Unauthorized');
    if (!phoneNumber) throw fail('INVALID_INPUT', 'phoneNumber is required');
    const customer = await customerService.updatePhone(customerId, String(phoneNumber));
    return customer;
  }),

  myOrders: wrap(async (req: Request) => {
    const customerId = req.user?.id;
    if (!customerId) throw fail("UNAUTHORIZED", "Unauthorized");
    const orders = await ordersService.listCustomerOrders(customerId);
    return orders.map((order) => ({
      id: order.id,
      status: order.status,
      branchId: order.branchId,
      fulfillmentType: order.fulfillmentType,
      createdAt: order.createdAt,
      orderTotal: order.orderTotal,
      items: order.items.map((item) => ({
        itemId: item.itemId,
        name: item.item?.name ?? "Item",
        quantity: item.quantity,
        price: item.price
      })),
      hasReview: !!order.review,
      canReview: ["delivered", "completed", "picked_up"].includes(order.status) && !order.review
    }));
  })
};






