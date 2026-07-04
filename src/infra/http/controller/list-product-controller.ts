import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeListProductsUseCase } from "../factories/make-list-products-use-case";
import { ProductPresenter } from "../presenters/product-presenter";

export async function listProductController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
  });

  const { page } = querySchema.parse(req.query);

  try {
    const listProductsUseCase = makeListProductsUseCase();

    const result = await listProductsUseCase.execute({
      page,
    });

    if (result.isLeft()) {
      return reply.status(400).send({
        message: "Unable to list products.",
      });
    }

    return reply.status(200).send({
      products: result.value.products.map(ProductPresenter.toHTTP),
    });
  } catch (error) {
    return reply.status(500).send(error);
  }
}
