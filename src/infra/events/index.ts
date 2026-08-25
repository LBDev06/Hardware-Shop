import { OnQuestionCreated } from "@/domain/notification/app/subscriber/on-question-created";
import { OnAnswerQuestionCreated } from "@/domain/notification/app/subscriber/on-answer-question-created";
import { OnOrderCreated } from "@/domain/notification/app/subscriber/on-order-created-event";
import { PrismaProductRepository } from "@/infra/db/repo/prisma-product-repository";
import { PrismaQuestionRepository } from "@/infra/db/repo/prisma-question-repository";
import { PrismaOrderRepository } from "@/infra/db/repo/prisma-order-repository";
import { SendNotificationUseCase } from "@/domain/notification/app/use-case/send-notification";
import { PrismaNotificationRepository } from "@/infra/db/repo/prisma-notification-repository";
import { outboxRelay } from "../db/outbox/outbox-relay";

export function registerNotificationSubscribers() {
  const notificationRepository = new PrismaNotificationRepository();
  const sendNotificationUseCase = new SendNotificationUseCase(notificationRepository);
  const productRepository = new PrismaProductRepository();
  const questionRepository = new PrismaQuestionRepository();
  const orderRepository = new PrismaOrderRepository();

  new OnQuestionCreated(productRepository, sendNotificationUseCase);
  new OnAnswerQuestionCreated(questionRepository, sendNotificationUseCase);
  new OnOrderCreated(orderRepository, productRepository, sendNotificationUseCase);
}

export { outboxRelay };


