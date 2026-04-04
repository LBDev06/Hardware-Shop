import { Question } from "../../enterprise/entities/question";

export interface QuestionRepository {
    create(comment: Question): Promise<void>
    save(commennt: Question): Promise<void>
}