import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeCreateAnswerQuestionUseCase } from "../factories/make-answer-question-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";

export async function createAnswerQuestionController(req: FastifyRequest, reply: FastifyReply){
    const idSchema = z.string().uuid()

    const paramsSchema = z.object({
        productId: z.string().uuid(),
        questionId: z.string().uuid()
    })

    const contentSchema = z.object({
        content: z.string().max(500)
    })

    const id = idSchema.parse(req.userId)
    const { productId, questionId } = paramsSchema.parse(req.params)
    const { content } = contentSchema.parse(req.body)

    try {
        const createAnswerQuestionUseCase = makeCreateAnswerQuestionUseCase()

        const result = await createAnswerQuestionUseCase.execute({
            authorId: id,
            productId,
            questionId,
            content
        })
       
        if(result.isLeft()){
            return HttpErrorPresenter.toHTTP(result.value, reply) 
        }
     
        return reply.status(201).send({message:"Answer created."})
    } catch (error) {
        return reply.status(500).send(error)
    }
}
