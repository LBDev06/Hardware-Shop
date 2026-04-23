import { InMemoryUsersRepository } from "../../../../../test/repo/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAnswerQuestionsRepository } from "test/repo/in-memory-answer-questions-repository";
import { ListAnswersByProductQuestionsUseCase } from "./list-answers-by-product-questions";
import { InMemoryQuestionRepository } from "test/repo/in-memory-question-repository";
import { makeQuestion } from "test/factories/makeQuestion";
import { makeAnswerQuestion } from '../../../../../test/factories/make-answer';
import { randomUUID } from "node:crypto";

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAnswerQuestionRepository: InMemoryAnswerQuestionsRepository
let sut: ListAnswersByProductQuestionsUseCase

describe('List Answers By Product Questions Use Case', () => {
    beforeEach(() => {
        inMemoryQuestionRepository = new InMemoryQuestionRepository()
        inMemoryAnswerQuestionRepository = new InMemoryAnswerQuestionsRepository()
        sut = new ListAnswersByProductQuestionsUseCase(inMemoryQuestionRepository, inMemoryAnswerQuestionRepository)
    })

    it('should be able to list answer by product questions', async () => {
        const question = await makeQuestion()
        await inMemoryQuestionRepository.create(question)

        const answer = await makeAnswerQuestion({
            questionId: question.id
        })

        await inMemoryAnswerQuestionRepository.save(answer)

        const result = await sut.execute({
            questionId: question.id.toString(),
            page: 1
        })

        expect(result.isRight()).toBe(true)
        if (result.isRight()) {
            expect(result.value.answers).toHaveLength(1)
        }
    })


    it('should be able to list paginated products', async () => {
        const question = await makeQuestion()

        await inMemoryQuestionRepository.create(question)

        const answer = await makeAnswerQuestion({
            questionId: question.id
        })

        for (let i = 1; i <= 22; i++) {
            await inMemoryAnswerQuestionRepository.save(answer)
        }

        const result = await sut.execute({
            questionId: question.id.toString(),
            page: 2
        })

        expect(result).toBeRight()
        if (result.isRight()) {
            expect(result.value.answers).toHaveLength(2)
        }
    })

    it('should not be able to list answer by product questions if question does not exists', async () => {
        const question = await makeQuestion()
        await inMemoryQuestionRepository.create(question)

        const answer = await makeAnswerQuestion({
            questionId: question.id
        })

        await inMemoryAnswerQuestionRepository.save(answer)
        await inMemoryAnswerQuestionRepository.save(answer)
        await inMemoryAnswerQuestionRepository.save(answer)

        const result = await sut.execute({
            questionId: randomUUID(),
            page: 1
        })

        expect(result).toBeLeft()
    })

})
