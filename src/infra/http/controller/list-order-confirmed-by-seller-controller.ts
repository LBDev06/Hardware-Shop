import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeListOrderConfirmedBySellerUseCase } from "../factories/make-list-order-confirmed-by-seller-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";
import { OrderPresenter } from "../presenters/order-presenter";

export async function listOrderConfirmedBySellerController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const userIdSchema = z.string().uuid();
  const sellerId = userIdSchema.parse(req.userId);

  try {
    const listOrderConfirmedBySellerUseCase =
      makeListOrderConfirmedBySellerUseCase();
    const result = await listOrderConfirmedBySellerUseCase.execute({
      sellerId,
    });

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }

    return reply.status(200).send({
      orders: result.value.orders.map(OrderPresenter.toHTTP),
    });
  } catch (error) {
    return reply.status(500).send(error);
  }
}
