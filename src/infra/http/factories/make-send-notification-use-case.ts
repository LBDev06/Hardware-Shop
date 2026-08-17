import { SendNotificationUseCase } from "@/domain/notification/app/use-case/send-notification";
import { PrismaNotificationRepository } from "@/infra/db/repo/prisma-notification-repository";

export function makeSendNotificationUseCase() {
  const notificationRepository = new PrismaNotificationRepository();
  const sendNotificationUseCase = new SendNotificationUseCase(notificationRepository);

  return sendNotificationUseCase;
}
