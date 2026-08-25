import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeListOrderHistoryUseCase } from "../factories/make-list-order-history-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";
import { OrderPresenter } from "../presenters/order-presenter";

export async function listOrderHistoryController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const userIdSchema = z.string().uuid();
  const clientId = userIdSchema.parse(req.userId);

  try {
    const listOrderHistoryUseCase = makeListOrderHistoryUseCase();
    const result = await listOrderHistoryUseCase.execute({
      clientId,
    });

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }

    const orders = result.value.orders ?? [];

    return reply.status(200).send({
      orders: orders.map(OrderPresenter.toHTTP),
    });
  } catch (error) {
    return reply.status(500).send(error);
  }
}
