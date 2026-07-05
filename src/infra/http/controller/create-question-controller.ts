import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeCreateQuestionUseCase } from "../factories/make-create-question-use-case";
import { HttpCreateQuestionErrorPresenter } from "../presenters/error/http-create-question-presenter-error";

export async function createQuestionController(req: FastifyRequest, reply: FastifyReply){
    const idSchema = z.string().uuid()

    const productIdSchema = z.object({
        productId: z.string().uuid()
    })

    const contentSchema = z.object({
        content: z.string().max(500)
    })

    const id = idSchema.parse(req.userId)
    const { productId } = productIdSchema.parse(req.params)
    const { content } = contentSchema.parse(req.body)

    try {
        const createQuestionUseCase = makeCreateQuestionUseCase()

        const result = await createQuestionUseCase.execute({
            authorId: id,
            productId,
            content
        })
       
        if(result.isLeft()){
            return HttpCreateQuestionErrorPresenter.toHTTP(result.value, reply) 
        }
     
        return reply.status(201).send({message:"Question created."})
    } catch (error) {
        return reply.status(500).send(error)
    }
}