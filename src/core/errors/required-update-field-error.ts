import { UseCaseError } from "../use-case-error";

export class RequiredUpdateFieldError extends Error implements UseCaseError {
    constructor(){
        super('When you change the category field, you must also update the specifications field.')
    }
}