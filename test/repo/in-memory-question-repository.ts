import { QuestionRepository } from "@/domain/marketplace/app/repo/question-repository";
import { Comment } from "@/domain/marketplace/enterprise/entities/question";

export class InMemoryQuestionRepository implements QuestionRepository {
    items: Comment[] = []

    async create(comment: Comment): Promise<void> {
        this.items.push(comment)
    }

    async save(comment: Comment): Promise<void> {
        const itemIndex = this.items.findIndex(item => item.id === comment.id)

        if (itemIndex >= 0) {
            this.items[itemIndex] = comment
        }
    }
}