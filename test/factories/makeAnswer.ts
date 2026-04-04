import { AnswerQuestion, AnswerQuestionProps } from "@/domain/marketplace/enterprise/entities/answer-question";
import { UniqueEntityId } from "@/core/unique-entity-id";

export async function makeAnswerQuestion(override: Partial<AnswerQuestionProps> = {}) {
    const answerQuestion = AnswerQuestion.create({
        authorId: new UniqueEntityId(),
        productId: new UniqueEntityId(),
        questionId: new UniqueEntityId(),
        content: '170W',
        createdAt: new Date(),
        ...override
    })

    return answerQuestion
}