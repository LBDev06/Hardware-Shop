import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeDeleteProductUseCase } from "../factories/make-delete-product-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";

export async function deleteProductController(req: FastifyRequest, reply: FastifyReply){
    const authorIdSchema = z.string().uuid()

    const productIdSchema = z.object({
        productId: z.string().uuid()
    })

    const authorId = authorIdSchema.parse(req.userId)
    const { productId } = productIdSchema.parse(req.params)
    
    try {
        const deleteProductUseCase = makeDeleteProductUseCase()

        const result = await deleteProductUseCase.execute({
            authorId,
            productId
        })

     if(result.isLeft()){
      return HttpErrorPresenter.toHTTP(result.value, reply)
     }
    return reply.status(201).send({
    message: "Product deleted."
    })
    } catch (error) {
        return reply.status(500).send(error)
    }
}