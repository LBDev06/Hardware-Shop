import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeDeleteAnswerQuestionUseCase } from "../factories/make-delete-answer-question-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";

export async function deleteAnswerQuestionController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const idSchema = z.string().uuid();
  const answerIdSchema = z.object({
    answerId: z.string().uuid(),
  });

  const authorId = idSchema.parse(req.userId);
  const { answerId } = answerIdSchema.parse(req.params);

  try {
    const deleteAnswerQuestionUseCase = makeDeleteAnswerQuestionUseCase();
    const result = await deleteAnswerQuestionUseCase.execute({
      authorId,
      answerId,
    });

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }

    return reply.status(200).send({ message: "Answer deleted." });
  } catch (error) {
    return reply.status(500).send(error);
  }
}
