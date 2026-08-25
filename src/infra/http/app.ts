import fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import { userRoutes } from "./routes/user-routes";
import { attachmentRoutes } from "./routes/attachment-routes";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import { productRoutes } from "./routes/product-routes";
import { cartRoutes } from "./routes/cart-routes";
import { notificationRoutes } from "./routes/notification-routes";
import { orderRoutes } from "./routes/order-routes";
import { registerNotificationSubscribers } from "../events";

export const app = fastify();

registerNotificationSubscribers();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(fastifyMultipart);
app.register(userRoutes);
app.register(productRoutes);
app.register(attachmentRoutes);
app.register(cartRoutes);
app.register(notificationRoutes);
app.register(orderRoutes);


