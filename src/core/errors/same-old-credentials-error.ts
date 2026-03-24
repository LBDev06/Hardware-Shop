import { UseCaseError } from "../use-case-error";

export class SameOldCredentialsError extends Error implements UseCaseError {
    constructor(){
        super('New credential must be different from the old credential.')
    }
}