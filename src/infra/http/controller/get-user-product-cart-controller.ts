import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeGetUserCartProduct } from "../factories/make-get-user-cart-product";
import { CartPresenter } from "../presenters/cart-presenter";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";

export async function getUserProductCartController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const userIdSchema = z.string().uuid();
  const userId = userIdSchema.parse(req.userId);

  try {
    const getUserProductCartUseCase = makeGetUserCartProduct();
    const result = await getUserProductCartUseCase.execute({ userId });

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }

    return reply.status(200).send({
      cart: CartPresenter.toHTTP(result.value.cart),
    });
  } catch (error) {
    return reply.status(500).send(error);
  }
}
