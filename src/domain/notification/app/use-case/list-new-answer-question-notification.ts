import { Either } from "@/core/either";
import { right } from "@/core/either";
import { NotificationsRepository } from "../repo/notification-repository";
import { Notification } from "../../enterprise/entities/notification";

interface ListNewAnswerQuestionNotificationUseCaseRequest {
    recipientId: string;
    eventType: 'ANSWER_QUESTION_CREATED'
}

type ListNewAnswerQuestionNotificationUseCaseResponse = Either<null, {
    notifications: Notification[]
}>

export class ListNewAnswerQuestionNotificationUseCase {
    constructor(
        private notificationRepository: NotificationsRepository
    ) { }

    async execute({
        recipientId,

    }: ListNewAnswerQuestionNotificationUseCaseRequest): Promise<ListNewAnswerQuestionNotificationUseCaseResponse> {

        const notifications = await this.notificationRepository.findMany(
            recipientId,
            { eventType: 'ANSWER_QUESTION_CREATED' }
        )

        return right({ notifications })
    }
}