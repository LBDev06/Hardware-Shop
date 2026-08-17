import { ListNewAnswerQuestionNotificationUseCase } from "@/domain/notification/app/use-case/list-new-answer-question-notification";
import { PrismaNotificationRepository } from "@/infra/db/repo/prisma-notification-repository";

export function makeListNewAnswerQuestionNotificationUseCase() {
  const notificationRepository = new PrismaNotificationRepository();
  const listNewAnswerQuestionNotificationUseCase = new ListNewAnswerQuestionNotificationUseCase(notificationRepository);

  return listNewAnswerQuestionNotificationUseCase;
}
