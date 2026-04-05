import { left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Either } from "@/core/either";
import { UsersRepository } from "../repo/users-repository";
import { UserNotAllowedError } from "@/core/errors/user-not-allowed-error";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repo/question-repository";

interface ListSellerProductQuestionsUseCaseRequest {
    userId: string;
    page: number
}

type ListSellerProductQuestionsUseCaseResponse = Either<ResourceNotFoundError | UserNotAllowedError, {
    questions: Question[]
}>

export class ListSellerProductQuestionsUseCase {
    constructor(
        private usersRepository: UsersRepository,
        private questionsRepository: QuestionRepository,
    ) { }

    async execute({
        userId,
        page
    }: ListSellerProductQuestionsUseCaseRequest): Promise<ListSellerProductQuestionsUseCaseResponse> {
        const user = await this.usersRepository.findById(userId)

        if (!user) {
            return left(new ResourceNotFoundError())
        }

        if (user.role.value !== 'seller') {
            return left(new UserNotAllowedError())
        }

        const questions = await this.questionsRepository.findManyQuestionsBySellerId(user.id.toString(), { page })

        return right({
            questions
        })
    }
}