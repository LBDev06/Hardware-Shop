import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeAddProductToCartUseCase } from "../factories/make-add-product-to-cart-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";

export async function addProductToCartController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const userIdSchema = z.string().uuid();
  const paramsSchema = z.object({
    productId: z.string().uuid(),
  });
  const quantitySchema = z.object({
    quantity: z.number().int().positive(),
  });

  const userId = userIdSchema.parse(req.userId);
  const { productId } = paramsSchema.parse(req.params);
  const { quantity } = quantitySchema.parse(req.body);

  try {
    const addProductToCartUseCase = makeAddProductToCartUseCase();
    const result = await addProductToCartUseCase.execute({
      userId,
      productId,
      quantity,
    });

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }

    return reply.status(201).send({ message: "Product added to cart." });
  } catch (error) {
    return reply.status(500).send(error);
  }
}
