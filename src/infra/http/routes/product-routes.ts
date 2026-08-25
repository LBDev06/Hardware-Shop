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
import { deleteAnswerQuestionController } from "../controller/delete-answer-question-controller";
import { listAnswersByProductQuestionsController } from "../controller/list-answers-by-product-questions-controller";

const productSchemaProperties = {
  id: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
  name: { type: "string", example: "Placa de Vídeo RTX 4070" },
  price: { type: "number", example: 450000, description: "Preço em centavos (ex: 450000 = R$ 4.500,00)" },
  stock: { type: "number", example: 10 },
  description: { type: "string", example: "Placa de vídeo de última geração com 12GB GDDR6X" },
  category: { type: "string", example: "GPU" },
  specs: { type: "object", additionalProperties: true, example: { memory: "12GB", bus: "192-bit" } },
  attachmentsIds: { type: "array", items: { type: "string", format: "uuid" } },
  createdAt: { type: "string", format: "date-time" },
};

export function productRoutes(app: FastifyInstance) {
  // --- PRODUTOS ---
  app.post(
    "/product/create",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Products"],
        summary: "Criar novo produto",
        description: "Permite a um vendedor cadastrar um novo produto de hardware no marketplace.",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["name", "price", "stock", "description", "specs", "category", "attachmentsIds"],
          properties: {
            name: { type: "string", maxLength: 50, example: "Placa de Vídeo RTX 4070" },
            price: { type: "number", minimum: 1, example: 450000, description: "Valor em centavos" },
            stock: { type: "number", minimum: 1, example: 15 },
            description: { type: "string", maxLength: 500, example: "Placa gráfica de alto desempenho com suporte a Ray Tracing e DLSS 3" },
            specs: { type: "object", additionalProperties: true, example: { memory: "12GB", chipset: "AD104" } },
            category: { type: "string", example: "GPU" },
            attachmentsIds: { type: "array", items: { type: "string", format: "uuid" }, example: [] },
          },
        },
        response: {
          201: {
            description: "Produto criado com sucesso",
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: productSchemaProperties,
              },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
          403: { description: "Permissão insuficiente (necessário ser Seller)", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    createProductController,
  );

  app.delete(
    "/product/:productId/delete",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Products"],
        summary: "Deletar produto",
        description: "Remove um produto pertencente ao vendedor autenticado.",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
          },
        },
        response: {
          201: {
            description: "Produto removido com sucesso",
            type: "object",
            properties: {
              message: { type: "string", example: "Product deleted." },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
          403: { description: "Produto pertence a outro vendedor", type: "object", properties: { message: { type: "string" } } },
          404: { description: "Produto não encontrado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    deleteProductController,
  );

  app.patch(
    "/product/:productId/edit",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Products"],
        summary: "Editar produto existente",
        description: "Atualiza informações parciais ou totais de um produto do vendedor.",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
          },
        },
        body: {
          type: "object",
          properties: {
            name: { type: "string", maxLength: 50, example: "RTX 4070 Super" },
            price: { type: "number", minimum: 1, example: 480000 },
            stock: { type: "number", minimum: 1, example: 8 },
            description: { type: "string", maxLength: 500, example: "Versão Super com mais núcleos CUDA" },
            specs: { type: "object", additionalProperties: true, example: { memory: "12GB", tdp: "220W" } },
            category: { type: "string", example: "GPU" },
            attachmentsIds: { type: "array", items: { type: "string", format: "uuid" } },
          },
        },
        response: {
          200: {
            description: "Produto atualizado com sucesso",
            type: "object",
            properties: {
              product: {
                type: "object",
                properties: productSchemaProperties,
              },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
          403: { description: "Não permitido / recurso de outro vendedor", type: "object", properties: { message: { type: "string" } } },
          404: { description: "Produto não encontrado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    editProductController,
  );

  app.get(
    "/product/list",
    {
      schema: {
        tags: ["Products"],
        summary: "Listar catálogo de produtos",
        description: "Lista produtos disponíveis de forma paginada (20 itens por página).",
        querystring: {
          type: "object",
          properties: {
            page: { type: "integer", minimum: 1, default: 1, example: 1 },
          },
        },
        response: {
          200: {
            description: "Lista de produtos retornada com sucesso",
            type: "object",
            properties: {
              products: {
                type: "array",
                items: {
                  type: "object",
                  properties: productSchemaProperties,
                },
              },
            },
          },
        },
      },
    },
    listProductController,
  );

  app.get(
    "/product/search",
    {
      schema: {
        tags: ["Products"],
        summary: "Buscar produtos por termo",
        description: "Pesquisa produtos por nome ou descrição.",
        querystring: {
          type: "object",
          required: ["search"],
          properties: {
            search: { type: "string", minLength: 1, example: "RTX" },
          },
        },
        response: {
          200: {
            description: "Resultados da busca",
            type: "object",
            properties: {
              products: {
                type: "array",
                items: {
                  type: "object",
                  properties: productSchemaProperties,
                },
              },
            },
          },
        },
      },
    },
    searchProductController,
  );

  app.get(
    "/product/by-seller",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Products"],
        summary: "Listar produtos do vendedor autenticado",
        description: "Retorna a listagem paginada de produtos criados pelo vendedor logado.",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            page: { type: "integer", minimum: 1, default: 1, example: 1 },
          },
        },
        response: {
          200: {
            description: "Produtos do vendedor",
            type: "object",
            properties: {
              products: {
                type: "array",
                items: {
                  type: "object",
                  properties: productSchemaProperties,
                },
              },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    listSellerProductController,
  );

  // --- PERGUNTAS (QUESTIONS) ---
  app.post(
    "/product/:productId/question",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Questions"],
        summary: "Criar pergunta sobre produto",
        description: "Registra uma dúvida do cliente sobre o produto. Dispara o evento de domínio QuestionCreatedEvent que notifica o vendedor.",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
          },
        },
        body: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", maxLength: 500, example: "Essa placa é compatível com PCI Express 4.0?" },
          },
        },
        response: {
          201: {
            description: "Pergunta criada com sucesso",
            type: "object",
            properties: {
              message: { type: "string", example: "Question created." },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
          404: { description: "Produto não encontrado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    createQuestionController,
  );

  app.get(
    "/product/:productId/questions",
    {
      schema: {
        tags: ["Questions"],
        summary: "Listar perguntas de um produto",
        description: "Retorna a listagem paginada de perguntas feitas em determinado produto.",
        params: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
          },
        },
        querystring: {
          type: "object",
          properties: {
            page: { type: "integer", minimum: 1, default: 1, example: 1 },
          },
        },
        response: {
          200: {
            description: "Perguntas do produto",
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    content: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          404: { description: "Produto não encontrado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    listProductQuestionsController,
  );

  app.put(
    "/product/questions/:questionId/edit",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Questions"],
        summary: "Editar pergunta",
        description: "Permite ao autor da dúvida editar o conteúdo da pergunta.",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["questionId"],
          properties: {
            questionId: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
          },
        },
        body: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", maxLength: 500, example: "Pergunta revisada e detalhada." },
          },
        },
        response: {
          200: {
            description: "Pergunta atualizada com sucesso",
            type: "object",
            properties: {
              message: { type: "string", example: "Updated question." },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
          403: { description: "Recurso pertence a outro usuário", type: "object", properties: { message: { type: "string" } } },
          404: { description: "Pergunta não encontrada", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    editProductQuestionController,
  );

  app.delete(
    "/product/questions/:questionId/delete",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Questions"],
        summary: "Deletar pergunta",
        description: "Permite ao autor da dúvida remover sua pergunta.",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["questionId"],
          properties: {
            questionId: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
          },
        },
        response: {
          200: {
            description: "Pergunta removida com sucesso",
            type: "object",
            properties: {
              message: { type: "string", example: "Question deleted" },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
          403: { description: "Recurso pertence a outro usuário", type: "object", properties: { message: { type: "string" } } },
          404: { description: "Pergunta não encontrada", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    deleteQuestionProductController,
  );

  app.get(
    "/product/seller/questions",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Questions"],
        summary: "Listar dúvidas recebidas pelo vendedor",
        description: "Retorna todas as perguntas pendentes ou recebidas em produtos pertencentes ao vendedor.",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            page: { type: "integer", minimum: 1, default: 1, example: 1 },
          },
        },
        response: {
          200: {
            description: "Lista de perguntas do vendedor",
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    content: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    listSellerProductQuestionsController,
  );

  // --- RESPOSTAS (ANSWERS) ---
  app.post(
    "/product/:productId/question/:questionId/answer",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Answers"],
        summary: "Responder pergunta sobre produto",
        description: "Permite ao vendedor responder a dúvida de um cliente. Dispara o AnswerQuestionsCreatedEvent gerando notificação para o autor da pergunta.",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["productId", "questionId"],
          properties: {
            productId: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
            questionId: { type: "string", format: "uuid", example: "8a0cda3c-2a6c-3aac-8acc-1a9c6a2cba5c" },
          },
        },
        body: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", maxLength: 500, example: "Sim, é 100% compatível com PCI Express 4.0 e retrocompatível com 3.0." },
          },
        },
        response: {
          201: {
            description: "Resposta cadastrada com sucesso",
            type: "object",
            properties: {
              message: { type: "string", example: "Answer created." },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
          403: { description: "Somente o autor do produto pode responder", type: "object", properties: { message: { type: "string" } } },
          404: { description: "Pergunta ou produto não encontrado", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    createAnswerQuestionController,
  );

  app.get(
    "/product/questions/:questionId/answers",
    {
      schema: {
        tags: ["Answers"],
        summary: "Listar respostas de uma pergunta",
        description: "Retorna a listagem paginada de respostas de uma pergunta específica.",
        params: {
          type: "object",
          required: ["questionId"],
          properties: {
            questionId: { type: "string", format: "uuid", example: "8a0cda3c-2a6c-3aac-8acc-1a9c6a2cba5c" },
          },
        },
        querystring: {
          type: "object",
          properties: {
            page: { type: "integer", minimum: 1, default: 1, example: 1 },
          },
        },
        response: {
          200: {
            description: "Lista de respostas",
            type: "object",
            properties: {
              answers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    authorId: { type: "string", format: "uuid" },
                    productId: { type: "string", format: "uuid" },
                    questionId: { type: "string", format: "uuid" },
                    content: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time", nullable: true },
                  },
                },
              },
            },
          },
          404: { description: "Pergunta não encontrada", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    listAnswersByProductQuestionsController,
  );

  app.put(
    "/product/answers/:answerId/edit",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Answers"],
        summary: "Editar resposta",
        description: "Permite ao autor da resposta editar seu conteúdo.",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["answerId"],
          properties: {
            answerId: { type: "string", format: "uuid", example: "7f9bba2b-1b5b-2aab-7abb-0a8b5a1ba4b" },
          },
        },
        body: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", maxLength: 500, example: "Resposta atualizada com detalhes adicionais." },
          },
        },
        response: {
          200: {
            description: "Resposta atualizada com sucesso",
            type: "object",
            properties: {
              message: { type: "string", example: "Updated answer." },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
          403: { description: "Recurso pertence a outro usuário", type: "object", properties: { message: { type: "string" } } },
          404: { description: "Resposta não encontrada", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    editAnswerQuestionController,
  );

  app.delete(
    "/product/answers/:answerId/delete",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Answers"],
        summary: "Deletar resposta",
        description: "Permite ao autor da resposta removê-la.",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["answerId"],
          properties: {
            answerId: { type: "string", format: "uuid", example: "7f9bba2b-1b5b-2aab-7abb-0a8b5a1ba4b" },
          },
        },
        response: {
          200: {
            description: "Resposta deletada com sucesso",
            type: "object",
            properties: {
              message: { type: "string", example: "Answer deleted." },
            },
          },
          401: { description: "Não autorizado", type: "object", properties: { message: { type: "string" } } },
          403: { description: "Recurso pertence a outro usuário", type: "object", properties: { message: { type: "string" } } },
          404: { description: "Resposta não encontrada", type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    deleteAnswerQuestionController,
  );
}

