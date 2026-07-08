import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeEditAnswerQuestionUseCase } from "../factories/make-edit-answer-question-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";

export async function editAnswerQuestionController(req: FastifyRequest, reply: FastifyReply) {
  const idSchema = z.string().uuid();

  const answerIdSchema = z.object({
    answerId: z.string().uuid(),
  });

  const contentSchema = z.object({
    content: z.string().max(500),
  });

  const id = idSchema.parse(req.userId);
  const { answerId } = answerIdSchema.parse(req.params);
  const { content } = contentSchema.parse(req.body);

  try {
    const editAnswerQuestionUseCase = makeEditAnswerQuestionUseCase();
    const result = await editAnswerQuestionUseCase.execute({
      authorId: id,
      answerId,
      content,
    });

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }

    return reply.status(200).send({ message: "Updated answer." });
  } catch (error) {
    return reply.status(500).send(error);
  }
}
