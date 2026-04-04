import { UserNotAllowedError } from "@/core/errors/user-not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Either } from "@/core/either";
import { AnswerQuestionRepository } from "../repo/answer-question-repository";
import { left, right } from "@/core/either";

interface DeleteAnswerQuestionUseCaseRequest {
    authorId: string;
    answerId: string;
}

type DeleteAnswerQuestionUseCaseResponse = Either<ResourceNotFoundError | UserNotAllowedError, {}>

export class DeleteAnswerQuestionUseCase {
    constructor(
        private answerQuestionRepository: AnswerQuestionRepository,
    ) { }

    async execute({
        authorId,
        answerId,
    }: DeleteAnswerQuestionUseCaseRequest): Promise<DeleteAnswerQuestionUseCaseResponse> {

        const answerQuestion = await this.answerQuestionRepository.findById(answerId)

        if (!answerQuestion) {
            return left(new ResourceNotFoundError())
        }

        if (answerQuestion.authorId.toString() !== authorId) {
            return left(new UserNotAllowedError)
        }

        await this.answerQuestionRepository.delete(answerId)

        return right({})
    }
}