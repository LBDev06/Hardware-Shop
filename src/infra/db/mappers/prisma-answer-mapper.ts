import { UniqueEntityId } from "@/core/unique-entity-id";
import { AnswerQuestion } from "@/domain/marketplace/enterprise/entities/answer-question";
import { Answer as PrismaAnswer } from "generated/prisma";

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): AnswerQuestion {
    return AnswerQuestion.create(
      {
        authorId: new UniqueEntityId(raw.authorId),
        productId: new UniqueEntityId(raw.productId),
        questionId: new UniqueEntityId(raw.questionId),
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(answerQuestion: AnswerQuestion) {
    return {
      id: answerQuestion.id.toString(),
      authorId: answerQuestion.authorId.toString(),
      productId: answerQuestion.productId.toString(),
      questionId: answerQuestion.questionId.toString(),
      content: answerQuestion.content,
      createdAt: answerQuestion.createdAt,
      updatedAt: answerQuestion.updatedAt,
    };
  }
}
