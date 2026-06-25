import { FastifyInstance } from "fastify";
import { registerUser } from "../controller/register-user";
import { loginUser } from "../controller/login-user";
import { changeUserPassword } from "../controller/change-user-password";
import { changeUserEmail } from "../controller/change-user-email";
import { changeUserRole } from "../controller/change-user-role";
import { profile } from "../controller/profile";
import { verifyJwt } from "../middleware/verify-jwt";
import { loginRequired } from "../middleware/login-required";

export function userRoutes(app: FastifyInstance) {
  app.post("/user/register", registerUser);
  app.post("/user/login", loginUser);
  app.patch(
    "/users/change-password",
    { onRequest: [verifyJwt, loginRequired] },
    changeUserPassword,
  );
  app.patch("/users/change-email", { onRequest: [verifyJwt, loginRequired] }, changeUserEmail);
  app.patch("/users/change-role", { onRequest: [verifyJwt, loginRequired] }, changeUserRole);
  app.get("/me", { onRequest : [ verifyJwt ]}, profile);
}
