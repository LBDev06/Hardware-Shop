import { DomainEvent } from "@/core/events/domain-event";
import { UniqueEntityId } from "@/core/unique-entity-id";
import { Question } from "@/domain/marketplace/enterprise/entities/question";
import { AnswerQuestion } from "@/domain/marketplace/enterprise/entities/answer-question";
import { QuestionCreatedEvent } from "@/domain/marketplace/enterprise/events/question-created-event";
import { AnswerQuestionsCreatedEvent } from "@/domain/marketplace/enterprise/events/answer-question-created";
import { OrderCreatedEvent } from "@/domain/payment/enterprise/events/order-created-event";
import { Order } from "@/domain/payment/enterprise/entities/order";
import { OrderItem } from "@/domain/payment/enterprise/entities/order-item";
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

    if (event instanceof OrderCreatedEvent) {
      return {
        aggregateId: event.order.id.toString(),
        eventType: OrderCreatedEvent.name,
        payload: {
          id: event.order.id.toString(),
          status: event.order.status,
          createdAt: event.order.createdAt?.toISOString(),
          items: event.order.items.map((item) => ({
            id: item.id.toString(),
            clientId: item.clientId.toString(),
            productId: item.productId.toString(),
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
          })),
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

    if (raw.eventType === OrderCreatedEvent.name) {
      const items = (payload.items ?? []).map((item: any) =>
        OrderItem.create(
          {
            clientId: new UniqueEntityId(item.clientId),
            productId: new UniqueEntityId(item.productId),
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
          },
          new UniqueEntityId(item.id)
        )
      );

      const order = Order.create(
        {
          items,
          status: payload.status,
          createdAt: payload.createdAt ? new Date(payload.createdAt) : undefined,
        },
        new UniqueEntityId(payload.id)
      );

      return new OrderCreatedEvent(order);
    }

    return null;
  }
}
