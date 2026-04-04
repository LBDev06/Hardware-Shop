import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UserNotAllowedError } from "@/core/errors/user-not-allowed-error";
import { AnswerQuestion } from "../../enterprise/entities/answer-question";
import { AnswerQuestionRepository } from "../repo/answer-question-repository";
import { QuestionRepository } from "../repo/question-repository";
import { UniqueEntityId } from "@/core/unique-entity-id";
import { ProductRepository } from "../repo/product-repository";
import { ResourceDoesNotBelongError } from "@/core/errors/resource-does-not-belong-error";

interface CreateAnswerQuestionUseCaseRequest {
    authorId: string;
    productId: string;
    questionId: string;
    content: string;
}

type CreateAnswerQuestionUseCaseResponse = Either<ResourceNotFoundError | UserNotAllowedError | ResourceDoesNotBelongError, {
    answerQuestion: AnswerQuestion
}>

export class CreateAnswerQuestionUseCase {
    constructor(
        private productRepository: ProductRepository,
        private questionRepository: QuestionRepository,
        private answerQuestionRepository: AnswerQuestionRepository
    ) { }

    async execute({
        authorId,
        productId,
        questionId,
        content
    }: CreateAnswerQuestionUseCaseRequest): Promise<CreateAnswerQuestionUseCaseResponse> {

        const product = await this.productRepository.findById(productId)

        if (!product) {
            return left(new ResourceNotFoundError())
        }

        const question = await this.questionRepository.findById(questionId)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (question.productId.toString() !== product.id.toString()) {
            return left(new ResourceDoesNotBelongError())
        }

        if (product.authorId.toString() !== authorId) {
            return left(new UserNotAllowedError())
        }

        const answerQuestion = AnswerQuestion.create({
            authorId: new UniqueEntityId(authorId),
            productId: new UniqueEntityId(productId),
            questionId: new UniqueEntityId(questionId),
            content: content
        })

        await this.answerQuestionRepository.save(answerQuestion)

        return right({
            answerQuestion
        })
    }
}