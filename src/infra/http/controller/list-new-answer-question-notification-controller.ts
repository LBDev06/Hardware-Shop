import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeListNewAnswerQuestionNotificationUseCase } from "../factories/make-list-new-answer-question-notification-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";
import { NotificationPresenter } from "../presenters/notification-presenter";

export async function listNewAnswerQuestionNotificationController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const userIdSchema = z.string().uuid();
  const userId = userIdSchema.parse(req.userId);

  try {
    const listNewAnswerQuestionNotificationUseCase =
      makeListNewAnswerQuestionNotificationUseCase();

    const result = await listNewAnswerQuestionNotificationUseCase.execute({
      recipientId: userId,
      eventType: "ANSWER_QUESTION_CREATED",
    });

    if (result.isLeft()) {
      return HttpErrorPresenter.toHTTP(result.value, reply);
    }

    return reply.status(200).send({
      notifications: result.value.notifications.map(NotificationPresenter.toHTTP),
    });
  } catch (error) {
    return reply.status(500).send(error);
  }
}
