import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeApproveOrderUseCase } from "../factories/make-approve-order-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";
import { OrderPresenter } from "../presenters/order-presenter";

export async function approveOrderController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    orderId: z.string().uuid(),
  });

  const { orderId } = paramsSchema.parse(req.params);

  try {
    const approveOrderUseCase = makeApproveOrderUseCase();
    const result = await approveOrderUseCase.execute({
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
