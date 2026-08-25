import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeRejectOrderUseCase } from "../factories/make-reject-order-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";
import { OrderPresenter } from "../presenters/order-presenter";

export async function rejectOrderController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    orderId: z.string().uuid(),
  });

  const { orderId } = paramsSchema.parse(req.params);

  try {
    const rejectOrderUseCase = makeRejectOrderUseCase();
    const result = await rejectOrderUseCase.execute({
      orderId,
    });

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }

    return reply.status(200).send({
      order: OrderPresenter.toHTTP(result.value.order),
    });
  } catch (error) {
    return reply.status(500).send(error);
  }
}
