import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeListNewQuestionsNotificationsUseCase } from "../factories/make-list-new-questions-notifications-use-case";
import { HttpErrorPresenter } from "../presenters/error/http-error-presenter";
import { NotificationPresenter } from "../presenters/notification-presenter";

export async function listNewQuestionsNotificationsController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const userIdSchema = z.string().uuid();
  const userId = userIdSchema.parse(req.userId);

  try {
    const listNewQuestionsNotificationsUseCase =
      makeListNewQuestionsNotificationsUseCase();

    const result = await listNewQuestionsNotificationsUseCase.execute({
      recipientId: userId,
      eventType: "QUESTION_CREATED",
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
