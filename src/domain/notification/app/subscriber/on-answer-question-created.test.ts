import { describe, it, beforeEach, vi, expect, MockInstance } from 'vitest'
import { OnAnswerQuestionCreated } from './on-answer-question-created'
import { makeQuestion } from 'test/factories/makeQuestion'
import { InMemoryQuestionRepository } from 'test/repo/in-memory-question-repository'
import { InMemoryProductsRepository } from 'test/repo/in-memory-product-repository'
import { SendNotificationUseCase } from '../use-case/send-notification'
import { InMemoryNotificationsRepository } from 'test/repo/in-memory-notification-repository'
import { makeAnswerQuestion } from 'test/factories/make-answer'
import { InMemoryAnswerQuestionsRepository } from 'test/repo/in-memory-answer-questions-repository'
import { waitFor } from 'test/utils/wait-for'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAnswerQuestionRepository: InMemoryAnswerQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationSpy: MockInstance<any>

describe('On Question Created', () => {
    beforeEach(() => {
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
        inMemoryAnswerQuestionRepository = new InMemoryAnswerQuestionsRepository()
        inMemoryQuestionRepository = new InMemoryQuestionRepository()
        sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository)
        sendNotificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')
        new OnAnswerQuestionCreated(inMemoryQuestionRepository, sendNotificationUseCase)
    })

    it('should send a notification when a question is created', async () => {
        const question = await makeQuestion()
        await inMemoryQuestionRepository.create(question)

        const answerQuestion = await makeAnswerQuestion({ questionId: question.id })
        await inMemoryAnswerQuestionRepository.save(answerQuestion)

        await waitFor(() => {
            expect(sendNotificationSpy).toHaveBeenCalled()
        })
    })
})