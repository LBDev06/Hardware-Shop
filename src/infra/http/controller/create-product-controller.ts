import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeCreateProductUseCase } from "../factories/make-create-product-use-case";
import { HttpCreateProductErrorPresenter } from "../presenters/error/http-create-product-error-presenter";
import { ProductPresenter } from "../presenters/product-presenter";

export async function createProductController(req: FastifyRequest, reply: FastifyReply){
   const idSchema = z.string().uuid()
  
   const createProductSchema = z.object({
    name: z.string().max(50),
    price: z.number().min(1),
    stock: z.number().min(1),
    description: z.string().max(500),
    specs: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
    category: z.string(),
    attachmentsIds: z.string().array()
   })

   const id = idSchema.parse(req.userId)
   const { name, price, stock, description, specs, category, attachmentsIds} = createProductSchema.parse(req.body)

   try {
    const createProductUseCase = makeCreateProductUseCase()

    const result = await createProductUseCase.execute({
        userId: id,
        name,
        price,
        stock,
        description,
        specs,
        attachmentsIds,
        category
    })

    if(result.isLeft()){
     return HttpCreateProductErrorPresenter.toHTTP(result.value, reply)
    }

   return reply.status(201).send({
         user: ProductPresenter.toHTTP(result.value.product),
    });

   } catch (error) {
     return reply.status(500).send(error)
   }
   
}