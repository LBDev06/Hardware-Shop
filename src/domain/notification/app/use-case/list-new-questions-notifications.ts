import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { NotificationsRepository } from '../repo/notification-repository'
import { Either, right } from '@/core/either'

interface ListNewQuestionsNotificationsUseCaseRequest {
    recipientId: string
    eventType: 'QUESTION_CREATED'
}

type ListNewQuestionsNotificationsUseCaseResponse = Either<null, {
    notifications: Notification[]
}>

export class ListNewQuestionsNotificationsUseCase {
    constructor(private notificationsRepository: NotificationsRepository) { }

    async execute({ recipientId, eventType }: ListNewQuestionsNotificationsUseCaseRequest): Promise<ListNewQuestionsNotificationsUseCaseResponse> {
        const notifications = await this.notificationsRepository.findMany(
            recipientId,
            { eventType: eventType }
        );

        return right({
            notifications
        })
    }
}