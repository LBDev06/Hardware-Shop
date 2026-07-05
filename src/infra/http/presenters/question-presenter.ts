import { Question } from "@/domain/marketplace/enterprise/entities/question";

export class QuestionPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.id.toString(),
      content: question.content,
      createdAt: question.createdAt.toISOString(),
    };
  }
}
