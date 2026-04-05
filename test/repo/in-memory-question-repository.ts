import { QuestionRepository } from "@/domain/marketplace/app/repo/question-repository";
import { Question } from "@/domain/marketplace/enterprise/entities/question";
import { PaginationParams } from "@/core/repo/pagination-params";

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

    async findManyQuestionsBySellerId(sellerId: string, { page }: PaginationParams): Promise<Question[]> {
        const question = this.items.filter(question => question.authorId.toString() === sellerId)
            .slice((page - 1) * 20, page * 20)

        return question
    }

    async findManyQuestionsByProductId(productId: string, { page }: PaginationParams): Promise<Question[]> {
        const question = this.items.filter(question => question.productId.toString() === productId)
            .slice((page - 1) * 20, page * 20)

        return question
    }
}