import { FastifyInstance } from "fastify";
import { loginRequired } from "../middleware/login-required";
import { verifyJwt } from "../middleware/verify-jwt";
import { listNewQuestionsNotificationsController } from "../controller/list-new-questions-notifications-controller";
import { listNewAnswerQuestionNotificationController } from "../controller/list-new-answer-question-notification-controller";

export function notificationRoutes(app: FastifyInstance) {
  app.get(
    "/notifications/questions",
    { onRequest: [verifyJwt, loginRequired] },
    listNewQuestionsNotificationsController,
  );
  app.get(
    "/notifications/answers",
    { onRequest: [verifyJwt, loginRequired] },
    listNewAnswerQuestionNotificationController,
  );
}
