import { UniqueEntityId } from "../unique-entity-id";

export interface DomainEvent {
    ocurredAt: Date
    getAggregateId(): UniqueEntityId
}
