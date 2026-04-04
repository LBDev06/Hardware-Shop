import { Question, QuestionProps } from "@/domain/marketplace/enterprise/entities/question";
import { UniqueEntityId } from "@/core/unique-entity-id";

export async function makeQuestion(override: Partial<QuestionProps> = {}) {
    const question = Question.create({
        authorId: new UniqueEntityId(),
        productId: new UniqueEntityId(),
        content: 'Qual é a voltagem dessa placa?',
        createdAt: new Date(),
        ...override
    })

    return question
}