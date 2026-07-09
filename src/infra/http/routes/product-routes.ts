import { FastifyInstance } from "fastify";
import { loginRequired } from "../middleware/login-required";
import { verifyJwt } from "../middleware/verify-jwt";
import { createProductController } from "../controller/create-product-controller";
import { deleteProductController } from "../controller/delete-product-controller";
import { listProductController } from "../controller/list-product-controller";
import { listSellerProductController } from "../controller/list-seller-product-controller";
import { searchProductController } from "../controller/search-product-controller";
import { createQuestionController } from "../controller/create-question-controller";
import { listProductQuestionsController } from "../controller/list-product-questions-controller";
import { listSellerProductQuestionsController } from "../controller/list-seller-product-questions-controller";
import { deleteQuestionProductController } from "../controller/delete-question-product-controller";
import { editProductQuestionController } from "../controller/edit-product-question-controller";
import { createAnswerQuestionController } from "../controller/create-answer-question-controller";
import { editAnswerQuestionController } from "../controller/edit-answer-question-controller";
import { editProductController } from "../controller/edit-product-controller";

export function productRoutes(app: FastifyInstance) {
  app.post(
    "/product/create",
    { onRequest: [verifyJwt, loginRequired] },
    createProductController,
  );

  app.delete(
    "/product/:productId/delete",
    { onRequest: [verifyJwt, loginRequired] },
    deleteProductController,
  );
  app.patch(
    "/product/:productId/edit",
    { onRequest: [verifyJwt, loginRequired] },
    editProductController,
  );
  app.get("/product/list", listProductController);

  app.get("/product/search", searchProductController);

  app.get(
    "/product/by-seller",
    { onRequest: [verifyJwt, loginRequired] },
    listSellerProductController,
  );
  app.post(
    "/product/:productId/question",
    { onRequest: [verifyJwt, loginRequired] },
    createQuestionController,
  );
  app.get("/product/:productId/questions", listProductQuestionsController);
  app.put(
    "/product/questions/:questionId/edit",
    { onRequest: [verifyJwt, loginRequired] },
    editProductQuestionController,
  );
  app.delete(
    "/product/questions/:questionId/delete",
    { onRequest: [verifyJwt, loginRequired] },
    deleteQuestionProductController,
  );
  app.post(
    "/product/:productId/question/:questionId/answer",
    { onRequest: [verifyJwt, loginRequired] },
    createAnswerQuestionController,
  );
  app.put(
    "/product/answers/:answerId/edit",
    { onRequest: [verifyJwt, loginRequired] },
    editAnswerQuestionController,
  );
  app.get(
    "/product/seller/questions",
    { onRequest: [verifyJwt, loginRequired] },
    listSellerProductQuestionsController,
  );
}
