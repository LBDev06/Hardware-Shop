import { Either, left, right } from "@/core/either";
import { UserNotAllowedError } from "@/core/errors/user-not-allowed-error";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repo/question-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface EditQuestionUseCaseRequest {
    authorId: string;
    questionId: string;
    content: string
}

type EditQuestionUseCaseResponse = Either<UserNotAllowedError, {
    question: Question
}>

export class EditQuestionUseCase {
    constructor(
        private questionRepository: QuestionRepository
    ) { }

    async execute({
        authorId,
        questionId,
        content
    }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
        const question = await this.questionRepository.findById(questionId)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (question.authorId.toString() !== authorId) {
            return left(new UserNotAllowedError())
        }

        question.content = content

        await this.questionRepository.save(question)

        return right({
            question
        })
    }
}