import { Question } from "../../enterprise/entities/question";
import { PaginationParams } from "@/core/repo/pagination-params";

export interface QuestionRepository {
    create(comment: Question): Promise<void>
    save(commennt: Question): Promise<void>
    findById(id: string): Promise<Question | null>
    delete(question: Question): Promise<void>
    findManyQuestionsBySellerId(sellerId: string, params: PaginationParams): Promise<Question[]>
    findManyQuestionsByProductId(productId: string, params: PaginationParams): Promise<Question[]>

}