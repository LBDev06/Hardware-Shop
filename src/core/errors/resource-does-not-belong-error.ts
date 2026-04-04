import { UseCaseError } from "../use-case-error";

export class ResourceDoesNotBelongError extends Error implements UseCaseError {
    constructor() {
        super('Resource does not belong error.')
    }
}
