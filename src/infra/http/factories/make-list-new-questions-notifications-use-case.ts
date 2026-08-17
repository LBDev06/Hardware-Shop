import { ListNewQuestionsNotificationsUseCase } from "@/domain/notification/app/use-case/list-new-questions-notifications";
import { PrismaNotificationRepository } from "@/infra/db/repo/prisma-notification-repository";

export function makeListNewQuestionsNotificationsUseCase() {
  const notificationRepository = new PrismaNotificationRepository();
  const listNewQuestionsNotificationsUseCase = new ListNewQuestionsNotificationsUseCase(notificationRepository);

  return listNewQuestionsNotificationsUseCase;
}
