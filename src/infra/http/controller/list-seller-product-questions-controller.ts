import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeListSellerProductQuestionsUseCase } from "../factories/make-list-seller-product-questions-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";
import { QuestionPresenter } from "../presenters/question-presenter";

export async function listSellerProductQuestionsController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const idSchema = z.string().uuid();

  const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
  });

  const userId = idSchema.parse(req.userId);
  const { page } = querySchema.parse(req.query);

  try {
  const listSellerProductQuestionsUseCase = makeListSellerProductQuestionsUseCase();

    const result = await listSellerProductQuestionsUseCase.execute({
      userId,
      page,
    });

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }

    return reply.status(200).send({
      questions: result.value.questions.map(QuestionPresenter.toHTTP),
    });
  } catch (error) {
    return reply.status(500).send(error);
  }
}
