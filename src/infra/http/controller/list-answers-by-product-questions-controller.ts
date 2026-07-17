import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"
import { makeListAnswersByProductQuestionsUseCase } from "../factories/make-list-answers-by-product-questions-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";
import { AnswerPresenter } from "../presenters/answer-presenter";

export async function listAnswersByProductQuestionsController(req: FastifyRequest, reply: FastifyReply){
    const questionIdSchema = z.object({
        questionId: z.string().uuid()
    })

    const querySchema = z.object({
        page: z.coerce.number().int().min(1).default(1),
    });
    
    const { questionId } = questionIdSchema.parse(req.params)
    const { page } = querySchema.parse(req.query);

    try {
        const listAnswersByProductQuestionsUseCase = makeListAnswersByProductQuestionsUseCase()

        const result = await listAnswersByProductQuestionsUseCase.execute({
            questionId,
            page
        })

        if(result.isLeft()){
            return HttpErrorPresenter.toHTTP(result.value, reply)
        }

        return reply.status(200).send({
            answers: result.value.answers.map(AnswerPresenter.toHTTP),
        })
    } catch (error) {
        return reply.status(500).send(error)
    }

}
