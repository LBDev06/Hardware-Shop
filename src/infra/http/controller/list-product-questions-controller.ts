import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"
import { makeListProductQuestionsCreateUseCase } from "../factories/make-list-prroduct-questions";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";
import { QuestionPresenter } from "../presenters/question-presenter";

export async function listProductQuestionsController(req: FastifyRequest, reply: FastifyReply){
    const productIdSchema = z.object({
        productId: z.string().uuid()
    })

      const querySchema = z.object({
        page: z.coerce.number().int().min(1).default(1),
      });
      
      const { productId } = productIdSchema.parse(req.params)
      const { page } = querySchema.parse(req.query);

      try {
        const listProductQuestionsUseCase = makeListProductQuestionsCreateUseCase()

        const result = await listProductQuestionsUseCase.execute({
        productId,
        page
        })

        if(result.isLeft()){
          return HttpErrorPresenter.toHTTP(result.value, reply)
        }

       return reply.status(200).send({
        questions: result.value.questions.map(QuestionPresenter.toHTTP),
       })
      } catch (error) {
        return reply.status(500).send(error)
      }

}
