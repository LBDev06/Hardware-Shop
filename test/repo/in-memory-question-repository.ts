import { QuestionRepository } from "@/domain/marketplace/app/repo/question-repository";
import { Question } from "@/domain/marketplace/enterprise/entities/question";

export class InMemoryQuestionRepository implements QuestionRepository {
    items: Question[] = []

    async create(question: Question): Promise<void> {
        this.items.push(question)
    }

    async save(question: Question): Promise<void> {
        const itemIndex = this.items.findIndex(item => item.id === question.id)

        if (itemIndex >= 0) {
            this.items[itemIndex] = question
        }
    }

    async findById(id: string): Promise<Question | null> {
        const question = this.items.find(item => item.id.toString() === id)

        if (!question) {
            return null
        }

        return question
    }

    async delete(question: Question): Promise<void> {
        const questionIndex = this.items.findIndex(item => item.id === question.id)
        this.items.splice(questionIndex, 1)
    }
}