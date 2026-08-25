import { FastifyInstance } from "fastify";
import { loginRequired } from "../middleware/login-required";
import { verifyJwt } from "../middleware/verify-jwt";
import { listNewQuestionsNotificationsController } from "../controller/list-new-questions-notifications-controller";
import { listNewAnswerQuestionNotificationController } from "../controller/list-new-answer-question-notification-controller";

const notificationSchemaProperties = {
  id: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
  recipientId: { type: "string", format: "uuid", example: "8a0cda3c-2a6c-3aac-8acc-1a9c6a2cba5c" },
  title: { type: "string", example: "New question in product RTX 4070" },
  content: { type: "string", example: "Essa placa é compatível com PCI Express 4.0?" },
  eventType: { type: "string", enum: ["QUESTION_CREATED", "ANSWER_QUESTION_CREATED", "ORDER_CREATED"], example: "QUESTION_CREATED" },
  createdAt: { type: "string", format: "date-time" },
};

export function notificationRoutes(app: FastifyInstance) {
  app.get(
    "/notifications/questions",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Notifications"],
        summary: "Listar notificações de novas perguntas",
        description: "Retorna a listagem de notificações de novas perguntas enviadas nos produtos do vendedor autenticado.",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Lista de notificações de perguntas",
            type: "object",
            properties: {
              notifications: {
                type: "array",
                items: {
                  type: "object",
                  properties: notificationSchemaProperties,
                },
              },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    listNewQuestionsNotificationsController,
  );

  app.get(
    "/notifications/answers",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Notifications"],
        summary: "Listar notificações de respostas a perguntas",
        description: "Retorna a listagem de notificações de respostas para dúvidas enviadas pelo cliente autenticado.",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Lista de notificações de respostas",
            type: "object",
            properties: {
              notifications: {
                type: "array",
                items: {
                  type: "object",
                  properties: notificationSchemaProperties,
                },
              },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    listNewAnswerQuestionNotificationController,
  );
}

