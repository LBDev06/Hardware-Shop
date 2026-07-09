import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeEditProductUseCase } from "../factories/make-edit-product-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";
import { ProductPresenter } from "../presenters/product-presenter";

export async function editProductController(req: FastifyRequest, reply: FastifyReply) {
  const idSchema = z.string().uuid();

  const paramsSchema = z.object({
    productId: z.string().uuid(),
  });

  const editProductSchema = z.object({
      name: z.string().max(50).optional(),
      price: z.number().min(1).optional(),
      stock: z.number().min(1).optional(),
      description: z.string().max(500).optional(),
      specs: z
        .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
        .optional(),
      category: z.string().optional(),
      attachmentsIds: z.string().array().optional(),})
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field must be provided.",
    });

  const authorId = idSchema.parse(req.userId);
  const { productId } = paramsSchema.parse(req.params);
  const { name, price, stock, description, specs, category, attachmentsIds } = editProductSchema.parse(req.body);

  try {
    const editProductUseCase = makeEditProductUseCase();

    const result = await editProductUseCase.execute({
      authorId,
      productId,
      name,
      price,
      stock,
      description,
      specs,
      category,
      attachmentsIds,
    });

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }

    return reply.status(200).send({
      product: ProductPresenter.toHTTP(result.value.product),
    });
  } catch (error) {
    return reply.status(500).send(error);
  }
}
