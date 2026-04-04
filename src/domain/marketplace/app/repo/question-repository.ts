import { Question } from "../../enterprise/entities/question";

export interface QuestionRepository {
    create(comment: Question): Promise<void>
    save(commennt: Question): Promise<void>
    findById(id: string): Promise<Question | null>
    delete(question: Question): Promise<void>
}