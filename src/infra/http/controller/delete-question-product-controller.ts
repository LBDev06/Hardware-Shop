import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeDeleteQuestionUseCase } from "../factories/make-delete-question-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";

export async function deleteQuestionProductController(req: FastifyRequest, reply: FastifyReply){
    const idSchema = z.string().uuid()
    const questionIdSchema = z.object({
        questionId: z.string().uuid()
    })

    const id = idSchema.parse(req.userId)
    const { questionId } = questionIdSchema.parse(req.params)

    try {
        const deleteQuestionUseCase = makeDeleteQuestionUseCase()
        const result = await deleteQuestionUseCase.execute({
            authorId: id,
            questionId
        })

        if(result.isLeft()){
            return HttpErrorPresenter.toHTTP(result.value, reply)
        }

        return reply.status(200).send({message: "Question deleted"})
    } catch (error) {
        return reply.status(500).send(error)
    }
}