import fastify from "fastify";
import { userRoutes } from "./routes/user-routes";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(userRoutes);
