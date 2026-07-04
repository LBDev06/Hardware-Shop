import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeSearchProductUseCase } from "../factories/make-search-product-use-case";
import { ProductPresenter } from "../presenters/product-presenter";

export async function searchProductController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    search: z.string().trim().min(1),
  });

  const { search } = querySchema.parse(req.query);

  try {
    const searchProductUseCase = makeSearchProductUseCase();

    const result = await searchProductUseCase.execute({
      query: search,
    });

    if (result.isLeft()) {
      return reply.status(400).send({
        message: "Unable to search products.",
      });
    }

    return reply.status(200).send({
      products: result.value.product?.map(ProductPresenter.toHTTP) ?? [],
    });
  } catch (error) {
    return reply.status(500).send(error);
  }
}
