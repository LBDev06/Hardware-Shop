import { OnQuestionCreated } from "@/domain/notification/app/subscriber/on-question-created";
import { OnAnswerQuestionCreated } from "@/domain/notification/app/subscriber/on-answer-question-created";
import { PrismaProductRespository } from "@/infra/db/repo/prisma-product-repository";
import { PrismaQuestionRepository } from "@/infra/db/repo/prisma-question-repository";
import { SendNotificationUseCase } from "@/domain/notification/app/use-case/send-notification";
import { PrismaNotificationRepository } from "@/infra/db/repo/prisma-notification-repository";
import { outboxRelay } from "../db/outbox/outbox-relay";

export function registerNotificationSubscribers() {
  const notificationRepository = new PrismaNotificationRepository();
  const sendNotificationUseCase = new SendNotificationUseCase(notificationRepository);
  const productRepository = new PrismaProductRespository();
  const questionRepository = new PrismaQuestionRepository();

  new OnQuestionCreated(productRepository, sendNotificationUseCase);
  new OnAnswerQuestionCreated(questionRepository, sendNotificationUseCase);
}

export { outboxRelay };

