import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeDeleteProductFromCartUseCase } from "../factories/make-delete-product-from-cart-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";

export async function deleteProductFromCartController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = z.string().uuid().parse(req.userId);
  const { productId } = z.object({ productId: z.string().uuid() }).parse(req.params);

  try {
    const deleteProductFromCartUseCase = makeDeleteProductFromCartUseCase();
    const result = await deleteProductFromCartUseCase.execute({
      userId,
      productId,
    });

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }

    return reply.status(200).send({ message: "Product removed from cart." });
  } catch (error) {
    return reply.status(500).send(error);
  }
}
