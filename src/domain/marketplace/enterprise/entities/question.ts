import { Entity } from "@/core/entity";
import { UniqueEntityId } from "@/core/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface QuestionProps {
    id?: UniqueEntityId;
    authorId: UniqueEntityId;
    productId: UniqueEntityId;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
}

export class Question extends Entity<QuestionProps> {
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

    static create(props: Optional<QuestionProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
        const question = new Question({
            ...props,
            createdAt: props.createdAt ?? new Date(),
            updatedAt: props.updatedAt ?? new Date()
        }, id)

        return question
    }
}