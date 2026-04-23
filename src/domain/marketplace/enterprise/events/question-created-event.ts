import { DomainEvent } from "@/core/events/domain-event";
import { Question } from "../entities/question";

export class QuestionCreatedEvent implements DomainEvent {
    public ocurredAt: Date;
    public question: Question;

    constructor(question: Question) {
        this.question = question
        this.ocurredAt = new Date()
    }

    getAggregateId() {
        return this.question.id
    }
} 1