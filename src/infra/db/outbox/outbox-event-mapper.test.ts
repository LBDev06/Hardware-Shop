import { describe, expect, it } from "vitest";
import { OutboxEventMapper } from "./outbox-event-mapper";
import { makeQuestion } from "test/factories/makeQuestion";
import { makeAnswerQuestion } from "test/factories/make-answer";
import { QuestionCreatedEvent } from "@/domain/marketplace/enterprise/events/question-created-event";
import { AnswerQuestionsCreatedEvent } from "@/domain/marketplace/enterprise/events/answer-question-created";

describe("OutboxEventMapper", () => {
  it("should serialize QuestionCreatedEvent to outbox format", async () => {
    const question = await makeQuestion();
    const event = new QuestionCreatedEvent(question);

    const outboxData = OutboxEventMapper.toOutbox(event);

    expect(outboxData.aggregateId).toBe(question.id.toString());
    expect(outboxData.eventType).toBe("QuestionCreatedEvent");
    expect(outboxData.payload).toEqual({
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      productId: question.productId.toString(),
      content: question.content,
      createdAt: question.createdAt.toISOString(),
      updatedAt: question.updatedAt?.toISOString(),
    });
  });

  it("should serialize AnswerQuestionsCreatedEvent to outbox format", async () => {
    const answer = await makeAnswerQuestion();
    const event = new AnswerQuestionsCreatedEvent(answer);

    const outboxData = OutboxEventMapper.toOutbox(event);

    expect(outboxData.aggregateId).toBe(answer.id.toString());
    expect(outboxData.eventType).toBe("AnswerQuestionsCreatedEvent");
    expect(outboxData.payload).toEqual({
      id: answer.id.toString(),
      authorId: answer.authorId.toString(),
      productId: answer.productId.toString(),
      questionId: answer.questionId.toString(),
      content: answer.content,
      createdAt: answer.createdAt.toISOString(),
      updatedAt: answer.updatedAt?.toISOString(),
    });
  });

  it("should deserialize QuestionCreatedEvent from outbox format", () => {
    const rawOutbox = {
      id: "outbox-1",
      aggregateId: "question-1",
      eventType: "QuestionCreatedEvent",
      payload: {
        id: "question-1",
        authorId: "author-1",
        productId: "product-1",
        content: "Funciona em 220v?",
        createdAt: new Date("2026-08-15T18:00:00Z").toISOString(),
      },
      publishedAt: null,
      createdAt: new Date(),
    };

    const domainEvent = OutboxEventMapper.toDomainEvent(rawOutbox) as QuestionCreatedEvent;

    expect(domainEvent).toBeInstanceOf(QuestionCreatedEvent);
    expect(domainEvent.question.id.toString()).toBe("question-1");
    expect(domainEvent.question.authorId.toString()).toBe("author-1");
    expect(domainEvent.question.productId.toString()).toBe("product-1");
    expect(domainEvent.question.content).toBe("Funciona em 220v?");
  });

  it("should deserialize AnswerQuestionsCreatedEvent from outbox format", () => {
    const rawOutbox = {
      id: "outbox-2",
      aggregateId: "answer-1",
      eventType: "AnswerQuestionsCreatedEvent",
      payload: {
        id: "answer-1",
        authorId: "author-1",
        productId: "product-1",
        questionId: "question-1",
        content: "Sim, é bivolt automático.",
        createdAt: new Date("2026-08-15T18:00:00Z").toISOString(),
      },
      publishedAt: null,
      createdAt: new Date(),
    };

    const domainEvent = OutboxEventMapper.toDomainEvent(rawOutbox) as AnswerQuestionsCreatedEvent;

    expect(domainEvent).toBeInstanceOf(AnswerQuestionsCreatedEvent);
    expect(domainEvent.answerQuestion.id.toString()).toBe("answer-1");
    expect(domainEvent.answerQuestion.questionId.toString()).toBe("question-1");
    expect(domainEvent.answerQuestion.content).toBe("Sim, é bivolt automático.");
  });
});
