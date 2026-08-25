import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeCheckoutUseCase } from "../factories/make-checkout-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";
import { OrderPresenter } from "../presenters/order-presenter";

export async function checkoutController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const userIdSchema = z.string().uuid();
  const bodySchema = z.object({
    productId: z.string().uuid(),
    productName: z.string().min(1),
    quantity: z.number().int().positive(),
    price: z.number().int().positive(),
    paymentMethodId: z.string().min(1),
  });

  const clientId = userIdSchema.parse(req.userId);
  const { productId, productName, quantity, price, paymentMethodId } =
    bodySchema.parse(req.body);

  try {
    const checkoutUseCase = makeCheckoutUseCase();
    const result = await checkoutUseCase.execute({
      clientId,
      productId,
      productName,
      quantity,
      price,
      paymentMethodId,
    });

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }

    return reply.status(201).send({
      order: OrderPresenter.toHTTP(result.value.order),
    });
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message });
    }
    return reply.status(500).send(error);
  }
}
