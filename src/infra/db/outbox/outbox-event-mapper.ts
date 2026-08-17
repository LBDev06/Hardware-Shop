import { DomainEvent } from "@/core/events/domain-event";
import { UniqueEntityId } from "@/core/unique-entity-id";
import { Question } from "@/domain/marketplace/enterprise/entities/question";
import { AnswerQuestion } from "@/domain/marketplace/enterprise/entities/answer-question";
import { QuestionCreatedEvent } from "@/domain/marketplace/enterprise/events/question-created-event";
import { AnswerQuestionsCreatedEvent } from "@/domain/marketplace/enterprise/events/answer-question-created";
import { Outbox as PrismaOutbox } from "generated/prisma";

export class OutboxEventMapper {
  static toOutbox(event: DomainEvent): {
    aggregateId: string;
    eventType: string;
    payload: any;
  } {
    if (event instanceof QuestionCreatedEvent) {
      return {
        aggregateId: event.question.id.toString(),
        eventType: QuestionCreatedEvent.name,
        payload: {
          id: event.question.id.toString(),
          authorId: event.question.authorId.toString(),
          productId: event.question.productId.toString(),
          content: event.question.content,
          createdAt: event.question.createdAt.toISOString(),
          updatedAt: event.question.updatedAt?.toISOString(),
        },
      };
    }

    if (event instanceof AnswerQuestionsCreatedEvent) {
      return {
        aggregateId: event.answerQuestion.id.toString(),
        eventType: AnswerQuestionsCreatedEvent.name,
        payload: {
          id: event.answerQuestion.id.toString(),
          authorId: event.answerQuestion.authorId.toString(),
          productId: event.answerQuestion.productId.toString(),
          questionId: event.answerQuestion.questionId.toString(),
          content: event.answerQuestion.content,
          createdAt: event.answerQuestion.createdAt.toISOString(),
          updatedAt: event.answerQuestion.updatedAt?.toISOString(),
        },
      };
    }

    return {
      aggregateId: event.getAggregateId().toString(),
      eventType: event.constructor.name,
      payload: JSON.parse(JSON.stringify(event)),
    };
  }

  static toDomainEvent(raw: PrismaOutbox): DomainEvent | null {
    const payload = raw.payload as any;

    if (raw.eventType === QuestionCreatedEvent.name) {
      const question = Question.create(
        {
          authorId: new UniqueEntityId(payload.authorId),
          productId: new UniqueEntityId(payload.productId),
          content: payload.content,
          createdAt: new Date(payload.createdAt),
          updatedAt: payload.updatedAt ? new Date(payload.updatedAt) : undefined,
        },
        new UniqueEntityId(payload.id)
      );

      return new QuestionCreatedEvent(question);
    }

    if (raw.eventType === AnswerQuestionsCreatedEvent.name) {
      const answerQuestion = AnswerQuestion.create(
        {
          authorId: new UniqueEntityId(payload.authorId),
          productId: new UniqueEntityId(payload.productId),
          questionId: new UniqueEntityId(payload.questionId),
          content: payload.content,
          createdAt: new Date(payload.createdAt),
          updatedAt: payload.updatedAt ? new Date(payload.updatedAt) : undefined,
        },
        new UniqueEntityId(payload.id)
      );

      return new AnswerQuestionsCreatedEvent(answerQuestion);
    }

    return null;
  }
}
