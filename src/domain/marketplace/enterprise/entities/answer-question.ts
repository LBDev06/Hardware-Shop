import { Entity } from "@/core/entity";
import { UniqueEntityId } from "@/core/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface AnswerQuestionProps {
    id?: UniqueEntityId;
    authorId: UniqueEntityId;
    productId: UniqueEntityId
    questionId: UniqueEntityId;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
}

export class AnswerQuestion extends Entity<AnswerQuestionProps> {
    get authorId() {
        return this.props.authorId
    }

    get content() {
        return this.props.content
    }

    set content(newContent: string) {
        this.props.content = newContent
        this.touch()
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

    static create(props: Optional<AnswerQuestionProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
        const answerQuestion = new AnswerQuestion({
            ...props,
            createdAt: props.createdAt ?? new Date(),
            updatedAt: props.updatedAt ?? new Date()
        }, id)

        return answerQuestion
    }

}