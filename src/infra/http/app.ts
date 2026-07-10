import fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import { userRoutes } from "./routes/user-routes";
import { attachmentRoutes } from "./routes/attachment-routes";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import { productRoutes } from "./routes/product-routes";
import { cartRoutes } from "./routes/cart-routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(fastifyMultipart);
app.register(userRoutes);
app.register(productRoutes)
app.register(attachmentRoutes);
app.register(cartRoutes);
