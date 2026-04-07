import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AnswerQuestion } from "../../enterprise/entities/answer-question";
import { QuestionRepository } from "../repo/question-repository";
import { AnswerQuestionRepository } from "../repo/answer-question-repository";

interface ListAnswersByProductQuestionsUseCaseRequest {
    questionId: string;
    page: number;
}

type ListAnswersByProductQuestionsUseCaseResponse = Either<ResourceNotFoundError, {
    answers: AnswerQuestion[]
}>

export class ListAnswersByProductQuestionsUseCase {
    constructor(
        private questionsRepository: QuestionRepository,
        private answerQuestionRepository: AnswerQuestionRepository
    ) { }

    async execute({
        questionId,
        page
    }: ListAnswersByProductQuestionsUseCaseRequest): Promise<ListAnswersByProductQuestionsUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        const answers = await this.answerQuestionRepository.findManyAnswersByQuestionId(questionId, { page })

        return right({
            answers
        })
    }

}