import { Either, left, right } from "@/core/either";
import { UserNotAllowedError } from "@/core/errors/user-not-allowed-error";
import { QuestionRepository } from "../repo/question-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface DeleteQuestionUseCaseRequest {
    authorId: string;
    questionId: string;
}

type DeleteQuestionUseCaseResponse = Either<ResourceNotFoundError | UserNotAllowedError, {}>

export class DeleteQuestionUseCase {
    constructor(
        private questionRepository: QuestionRepository
    ) { }

    async execute({
        authorId,
        questionId,
    }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
        const question = await this.questionRepository.findById(questionId)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (question.authorId.toString() !== authorId) {
            return left(new UserNotAllowedError())
        }

        await this.questionRepository.delete(question)

        return right({})
    }
}