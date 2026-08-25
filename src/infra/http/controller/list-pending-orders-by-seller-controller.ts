import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeListPendingOrdersBySellerUseCase } from "../factories/make-list-pending-orders-by-seller-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";
import { OrderPresenter } from "../presenters/order-presenter";

export async function listPendingOrdersBySellerController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const userIdSchema = z.string().uuid();
  const sellerId = userIdSchema.parse(req.userId);

  try {
    const listPendingOrdersBySellerUseCase =
      makeListPendingOrdersBySellerUseCase();
    const result = await listPendingOrdersBySellerUseCase.execute({
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
