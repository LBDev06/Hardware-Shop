import { FastifyInstance } from "fastify";
import { registerUserController } from "../controller/register-user-controller";
import { loginUserController } from "../controller/login-user-controller";
import { changeUserPasswordController } from "../controller/change-user-password-controller";
import { changeUserEmailController } from "../controller/change-user-email-controller";
import { changeUserRoleController } from "../controller/change-user-role-controller";
import { profileController } from "../controller/profile-controller";
import { verifyJwt } from "../middleware/verify-jwt";
import { loginRequired } from "../middleware/login-required";

export function userRoutes(app: FastifyInstance) {
  app.post("/user/register", registerUserController);
  app.post("/user/login", loginUserController);
  app.patch(
    "/users/change-password",
    { onRequest: [verifyJwt, loginRequired] },
    changeUserPasswordController,
  );
  app.patch("/users/change-email", { onRequest: [verifyJwt, loginRequired] }, changeUserEmailController);
  app.patch("/users/change-role", { onRequest: [verifyJwt, loginRequired] }, changeUserRoleController);
  app.get("/me", { onRequest : [ verifyJwt ]}, profileController);
}
