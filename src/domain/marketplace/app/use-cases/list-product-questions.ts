import { left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Either } from "@/core/either";
import { UsersRepository } from "../repo/users-repository";
import { UserNotAllowedError } from "@/core/errors/user-not-allowed-error";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repo/question-repository";
import { ProductRepository } from "../repo/product-repository";

interface ListProductQuestionsUseCaseRequest {
    productId: string;
    page: number
}

type ListProductQuestionsUseCaseResponse = Either<ResourceNotFoundError | UserNotAllowedError, {
    questions: Question[]
}>

export class ListProductQuestionsUseCase {
    constructor(
        private productsRepository: ProductRepository,
        private questionsRepository: QuestionRepository,
    ) { }

    async execute({
        productId,
        page
    }: ListProductQuestionsUseCaseRequest): Promise<ListProductQuestionsUseCaseResponse> {
        const product = await this.productsRepository.findById(productId)

        if (!product) {
            return left(new ResourceNotFoundError())
        }

        const questions = await this.questionsRepository.findManyQuestionsByProductId(productId, { page })

        return right({
            questions
        })
    }
}