import { AnswerQuestion } from "@/domain/marketplace/enterprise/entities/answer-question";

export class AnswerPresenter {
  static toHTTP(answer: AnswerQuestion) {
    return {
      id: answer.id.toString(),
      authorId: answer.authorId.toString(),
      productId: answer.productId.toString(),
      questionId: answer.questionId.toString(),
      content: answer.content,
      createdAt: answer.createdAt.toISOString(),
      updatedAt: answer.updatedAt?.toISOString() ?? null,
    };
  }
}
