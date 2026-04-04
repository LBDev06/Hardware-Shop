import { Either, right } from "@/core/either";
import { AnswerQuestion } from "../../enterprise/entities/answer-question";
import { AnswerQuestionRepository } from "../repo/answer-question-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UserNotAllowedError } from "@/core/errors/user-not-allowed-error";
import { left } from "@/core/either";

interface EditAnswerQuestionUseCaseRequest {
    authorId: string;
    answerId: string;
    content: string;
}

type EditAnswerQuestionUseCaseResponse = Either<ResourceNotFoundError | UserNotAllowedError, {
    answerQuestion: AnswerQuestion
}>

export class EditAnswerQuestionUseCase {
    constructor(
        private answersQuestionsRepository: AnswerQuestionRepository
    ) { }

    async execute({
        authorId,
        answerId,
        content
    }: EditAnswerQuestionUseCaseRequest): Promise<EditAnswerQuestionUseCaseResponse> {
        const answerQuestion = await this.answersQuestionsRepository.findById(answerId)

        if (!answerQuestion) {
            return left(new ResourceNotFoundError())
        }

        if (answerQuestion.authorId.toString() !== authorId) {
            return left(new UserNotAllowedError())
        }

        answerQuestion.content = content

        await this.answersQuestionsRepository.save(answerQuestion)

        return right({
            answerQuestion
        })

    }
}