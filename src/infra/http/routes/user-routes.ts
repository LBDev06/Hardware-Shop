import { FastifyInstance } from "fastify";
import { registerUser } from "../controller/register-user";

export function userRoutes(app: FastifyInstance) {
  app.post("/user/register", registerUser);
}
