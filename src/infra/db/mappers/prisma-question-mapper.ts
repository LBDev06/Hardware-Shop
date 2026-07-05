import { UniqueEntityId } from "@/core/unique-entity-id";
import { Question } from "@/domain/marketplace/enterprise/entities/question";
import { Question as PrismaQuestion } from "generated/prisma";

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        authorId: new UniqueEntityId(raw.authorId),
        productId: new UniqueEntityId(raw.productId),
        content: raw.content,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(question: Question) {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      productId: question.productId.toString(),
      content: question.content,
      createdAt: question.createdAt,
    };
  }
}
