import { UniqueEntityId } from "@/core/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { QuestionCreatedEvent } from "../events/question-created-event";

export interface QuestionProps {
    id?: UniqueEntityId;
    authorId: UniqueEntityId;
    productId: UniqueEntityId;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
    get authorId() {
        return this.props.authorId
    }

    get productId() {
        return this.props.productId
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

        const isNewQuestion = !id

        if (isNewQuestion) {
            question.addDomainEvent(new QuestionCreatedEvent(question))
        }

        return question
    }
}