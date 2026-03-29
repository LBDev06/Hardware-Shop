import { UseCaseError } from "../use-case-error";

export class UserNotAllowedError extends Error implements UseCaseError {
    constructor() {
        super('User not allowed.')
    }
}