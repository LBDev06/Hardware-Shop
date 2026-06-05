import { FastifyInstance } from "fastify";
import { registerUser } from "../controller/register-user";
import { loginUser } from "../controller/login-user";
import { changeUserPassword } from "../controller/change-user-password";
import { changeUserEmail } from "../controller/change-user-email";
import { changeUserRole } from "../controller/change-user-role";
import { profile } from "../controller/profile";

export function userRoutes(app: FastifyInstance) {
  app.post("/user/register", registerUser);
  app.post("/user/login", loginUser);
  app.patch("/users/:id/change-password", changeUserPassword);
  app.patch("/users/:id/change-email", changeUserEmail);
  app.patch("/users/:id/change-role", changeUserRole);
  app.get("/me", profile);
}
