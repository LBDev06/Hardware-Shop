import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeEditQuestionUseCase } from "../factories/make-edit-question-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";

export async function editProductQuestionController(req: FastifyRequest, reply: FastifyReply){
    const idSchema = z.string().uuid()

    const contentSchema = z.object(({
        content:z.string().max(500)
    }))

    const questionIdSchema = z.object({
        questionId: z.string().uuid()
    })
    
    const id = idSchema.parse(req.userId)
    const { content } = contentSchema.parse(req.body)
    const { questionId } = questionIdSchema.parse(req.params)

    try {
        const editQuestionUseCase = makeEditQuestionUseCase()
        const result = await editQuestionUseCase.execute({
            authorId: id,
            content,
            questionId
        })

        if(result.isLeft()){
            return HttpErrorPresenter.toHTTP(result.value, reply)
        }

        return reply.status(200).send({message: "Updated question."})
    } catch (error) {
        return reply.status(500).send(error)
    }
}