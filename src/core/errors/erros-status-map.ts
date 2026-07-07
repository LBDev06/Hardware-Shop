import { ResourceNotFoundError } from "./resource-not-found-error";
import { UserNotAllowedError } from "./user-not-allowed-error";
import { UserNotFoundError } from "./user-not-found-error";
import { ResourceDoesNotBelongError } from "./resource-does-not-belong-error";
import { InvalidCredentialError } from "./invalid-credential-error";
import { UserAlreadyExistsError } from "./user-already-exists-error";
import { SameOldCredentialsError } from "./same-old-credentials-error";

export const errorStatusMap = new Map<Function, number>([
  [ResourceNotFoundError, 404],
  [UserNotFoundError, 404],
  [UserNotAllowedError, 403],
  [ResourceDoesNotBelongError, 403],
  [InvalidCredentialError, 401],
  [UserAlreadyExistsError, 409],
  [SameOldCredentialsError, 400],
]);