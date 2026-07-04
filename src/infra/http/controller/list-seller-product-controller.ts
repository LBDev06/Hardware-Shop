import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { ProductPresenter } from "../presenters/product-presenter";
import { makeListSellerProductUseCase } from "../factories/make-list-seller-product"

export async function listSellerProductController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
 
  const idSchema = z.string().uuid()

  const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
  });

  const { page } = querySchema.parse(req.query);
  const id = idSchema.parse(req.userId)

  try {
    const listSellerProductsUseCase = makeListSellerProductUseCase();

    const result = await listSellerProductsUseCase.execute({
      page,
      userId:id
    });

    if (result.isLeft()) {
      return reply.status(400).send({
        message: "Unable to list products.",
      });
    }

    return reply.status(200).send({
      products: result.value.products?.map(ProductPresenter.toHTTP),
    });
  } catch (error) {
    return reply.status(500).send(error);
  }
}
