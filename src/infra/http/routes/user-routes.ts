import { FastifyInstance } from "fastify";
import { registerUser } from "../controller/register-user";
import { loginUser } from "../controller/login-user";

export function userRoutes(app: FastifyInstance) {
  app.post("/user/register", registerUser);
  app.post("/user/login", loginUser);
}
