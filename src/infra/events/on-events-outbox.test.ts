import { beforeEach, describe, expect, it, vi } from "vitest";
import { PrismaQuestionRepository } from "@/infra/db/repo/prisma-question-repository";
import { PrismaAnswerRepository } from "@/infra/db/repo/prisma-answer-repository";
import { OnQuestionCreated } from "@/domain/notification/app/subscriber/on-question-created";
import { OnAnswerQuestionCreated } from "@/domain/notification/app/subscriber/on-answer-question-created";
import { SendNotificationUseCase } from "@/domain/notification/app/use-case/send-notification";
import { InMemoryNotificationsRepository } from "test/repo/in-memory-notification-repository";
import { InMemoryProductsRepository } from "test/repo/in-memory-product-repository";
import { InMemoryQuestionRepository } from "test/repo/in-memory-question-repository";
import { makeProduct } from "test/factories/makeProduct";
import { makeQuestion } from "test/factories/makeQuestion";
import { makeAnswerQuestion } from "test/factories/make-answer";
import { db } from "@/infra/db/libs/prisma";
import { waitFor } from "test/utils/wait-for";
import { DomainEvents } from "@/core/events/domain-events";
import { outboxRelay } from "@/infra/db/outbox/outbox-relay";

describe("Outbox pattern on Question and Answer events dispatch", () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
  let inMemoryProductRepository: InMemoryProductsRepository;
  let inMemoryQuestionRepository: InMemoryQuestionRepository;
  let sendNotificationUseCase: SendNotificationUseCase;

  let prismaQuestionRepository: PrismaQuestionRepository;
  let prismaAnswerRepository: PrismaAnswerRepository;

  beforeEach(() => {
    DomainEvents.clearHandlers();
    DomainEvents.clearMarkedAggregates();

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    inMemoryProductRepository = new InMemoryProductsRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository();

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    );

    new OnQuestionCreated(inMemoryProductRepository, sendNotificationUseCase);
    new OnAnswerQuestionCreated(inMemoryQuestionRepository, sendNotificationUseCase);

    prismaQuestionRepository = new PrismaQuestionRepository();
    prismaAnswerRepository = new PrismaAnswerRepository();

    vi.restoreAllMocks();
  });

  it("should save Question and outbox event transactionally, then trigger notification", async () => {
    const product = await makeProduct();
    inMemoryProductRepository.products.push(product);

    const question = await makeQuestion({
      productId: product.id,
      content: "Qual é a garantia deste produto?",
    });

    const outboxCreateSpy = vi.fn().mockResolvedValue({
      id: "outbox-1",
      aggregateId: question.id.toString(),
      eventType: "QuestionCreatedEvent",
      payload: {},
      publishedAt: null,
      createdAt: new Date(),
    });

    const questionUpsertSpy = vi.fn().mockResolvedValue({
      id: question.id.toString(),
      productId: question.productId.toString(),
      authorId: question.authorId.toString(),
      content: question.content,
      createdAt: question.createdAt,
    });

    vi.spyOn(db, "$transaction").mockImplementation(async (callback: any) => {
      return callback({
        question: { upsert: questionUpsertSpy },
        outbox: { create: outboxCreateSpy },
      });
    });

    await prismaQuestionRepository.save(question);

    expect(questionUpsertSpy).toHaveBeenCalled();
    expect(outboxCreateSpy).toHaveBeenCalledWith({
      data: expect.objectContaining({
        aggregateId: question.id.toString(),
        eventType: "QuestionCreatedEvent",
      }),
    });

    await waitFor(() => {
      expect(inMemoryNotificationsRepository.items).toHaveLength(1);
      expect(inMemoryNotificationsRepository.items[0].recipientId.toString()).toBe(
        product.authorId.toString()
      );
      expect(inMemoryNotificationsRepository.items[0].eventType).toBe(
        "QUESTION_CREATED"
      );
      expect(inMemoryNotificationsRepository.items[0].title).toBe(
        `Nova pergunta em ${product.name}`
      );
    });
  });

  it("should save Answer and outbox event transactionally, then trigger notification", async () => {
    const question = await makeQuestion();
    inMemoryQuestionRepository.items.push(question);

    const answer = await makeAnswerQuestion({
      questionId: question.id,
      content: "A garantia é de 12 meses de fábrica.",
    });

    const outboxCreateSpy = vi.fn().mockResolvedValue({
      id: "outbox-2",
      aggregateId: answer.id.toString(),
      eventType: "AnswerQuestionsCreatedEvent",
      payload: {},
      publishedAt: null,
      createdAt: new Date(),
    });

    const answerUpsertSpy = vi.fn().mockResolvedValue({
      id: answer.id.toString(),
      authorId: answer.authorId.toString(),
      productId: answer.productId.toString(),
      questionId: answer.questionId.toString(),
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt ?? new Date(),
    });

    vi.spyOn(db, "$transaction").mockImplementation(async (callback: any) => {
      return callback({
        answer: { upsert: answerUpsertSpy },
        outbox: { create: outboxCreateSpy },
      });
    });

    await prismaAnswerRepository.save(answer);

    expect(answerUpsertSpy).toHaveBeenCalled();
    expect(outboxCreateSpy).toHaveBeenCalledWith({
      data: expect.objectContaining({
        aggregateId: answer.id.toString(),
        eventType: "AnswerQuestionsCreatedEvent",
      }),
    });

    await waitFor(() => {
      expect(inMemoryNotificationsRepository.items).toHaveLength(1);
      expect(inMemoryNotificationsRepository.items[0].recipientId.toString()).toBe(
        question.authorId.toString()
      );
      expect(inMemoryNotificationsRepository.items[0].eventType).toBe(
        "ANSWER_QUESTION_CREATED"
      );
      expect(inMemoryNotificationsRepository.items[0].title).toBe(
        "Nova resposta em sua pergunta"
      );
    });
  });

  it("should allow OutboxRelay to process outbox records from DB and dispatch notifications", async () => {
    const product = await makeProduct();
    inMemoryProductRepository.products.push(product);

    const rawOutboxQuestion = {
      id: "outbox-123",
      aggregateId: "question-123",
      eventType: "QuestionCreatedEvent",
      payload: {
        id: "question-123",
        authorId: "author-123",
        productId: product.id.toString(),
        content: "Vocês entregam para o Nordeste?",
        createdAt: new Date().toISOString(),
      },
      publishedAt: null,
      createdAt: new Date(),
    };

    vi.spyOn(db.outbox, "findMany").mockResolvedValue([rawOutboxQuestion]);
    vi.spyOn(db.outbox, "update").mockResolvedValue({
      ...rawOutboxQuestion,
      publishedAt: new Date(),
    });

    const publishedCount = await outboxRelay.publishPendingEvents();

    expect(publishedCount).toBe(1);

    await waitFor(() => {
      expect(inMemoryNotificationsRepository.items).toHaveLength(1);
      expect(inMemoryNotificationsRepository.items[0].recipientId.toString()).toBe(
        product.authorId.toString()
      );
      expect(inMemoryNotificationsRepository.items[0].eventType).toBe(
        "QUESTION_CREATED"
      );
      expect(inMemoryNotificationsRepository.items[0].title).toBe(
        `Nova pergunta em ${product.name}`
      );
    });
  });
});
