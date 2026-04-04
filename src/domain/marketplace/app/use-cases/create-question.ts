import { Either, left, right } from "@/core/either";
import { QuestionRepository } from "../repo/question-repository";
import { ProductRepository } from "../repo/product-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Question } from "../../enterprise/entities/question";
import { UniqueEntityId } from "@/core/unique-entity-id";

interface CreateQuestionUseCaseRequest {
    authorId: string;
    productId: string;
    content: string;
}

type CreateQuestiontUseCaseResponse = Either<ResourceNotFoundError, {
    question: Question
}>


export class CreateQuestionUseCase {
    constructor(
        private questionRepository: QuestionRepository,
        private productRepository: ProductRepository
    ) { }

    async execute({
        authorId,
        productId,
        content
    }: CreateQuestionUseCaseRequest): Promise<CreateQuestiontUseCaseResponse> {
        const product = await this.productRepository.findById(productId)

        if (!product) {
            return left(new ResourceNotFoundError())
        }

        const question = Question.create({
            authorId: new UniqueEntityId(authorId),
            productId: new UniqueEntityId(productId),
            content: content
        })

        await this.questionRepository.save(question)

        return right({
            question
        })
    }
}