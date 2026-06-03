import Joi from 'joi';

export const createOrderSchema = Joi.object({
  body: Joi.object({
    userId: Joi.number().required(),
    branchId: Joi.number().required(),
    items: Joi.array().items(
      Joi.object({
        productId: Joi.number().required(),
        quantity: Joi.number().min(1).required()
      })
    ).required(),
    paymentMethod: Joi.string().required()
  }),
  params: Joi.object(),
  query: Joi.object()
});
