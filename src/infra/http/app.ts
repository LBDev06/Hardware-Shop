import fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { userRoutes } from "./routes/user-routes";
import { attachmentRoutes } from "./routes/attachment-routes";
import { env } from "./env";
import { productRoutes } from "./routes/product-routes";
import { cartRoutes } from "./routes/cart-routes";
import { notificationRoutes } from "./routes/notification-routes";
import { orderRoutes } from "./routes/order-routes";
import { registerNotificationSubscribers } from "../events";

export const app = fastify({
  ajv: {
    customOptions: {
      strict: false,
    },
  },
});

registerNotificationSubscribers();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(fastifySwagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Hardware Shop API",
      description:
        "API RESTful de Marketplace de Hardware de alta performance. Desenvolvida com Fastify, TypeScript, PostgreSQL (Prisma ORM), Clean Architecture, Domain-Driven Design (DDD), Domain Events com Pub/Sub e Transactional Outbox Pattern.",
      version: "1.0.0",
      contact: {
        name: "Hardware Shop Team",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Servidor Local de Desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Insira o token JWT no cabeçalho Authorization: Bearer <token>",
        },
      },
    },
    tags: [
      { name: "Users", description: "Autenticação, registro e gerenciamento de perfil dos usuários" },
      { name: "Products", description: "Catálogo, listagem, busca e gerenciamento de produtos de hardware" },
      { name: "Questions", description: "Perguntas e dúvidas de clientes em produtos" },
      { name: "Answers", description: "Respostas de vendedores e autores para as dúvidas" },
      { name: "Cart", description: "Gerenciamento do carrinho de compras do cliente" },
      { name: "Orders & Checkout", description: "Processamento de pedidos, checkout com Stripe e status" },
      { name: "Notifications", description: "Notificações geradas via Domain Events (perguntas, respostas, pedidos)" },
      { name: "Attachments", description: "Upload de imagens e anexos de produtos (Cloudinary/Storage)" },
    ],
  },
});

if (env.NODE_ENV !== "production") {
  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
}

app.register(fastifyMultipart);
app.register(userRoutes);
app.register(productRoutes);
app.register(attachmentRoutes);
app.register(cartRoutes);
app.register(notificationRoutes);
app.register(orderRoutes);



