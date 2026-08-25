import { FastifyInstance } from "fastify";
import { registerUserController } from "../controller/register-user-controller";
import { loginUserController } from "../controller/login-user-controller";
import { changeUserPasswordController } from "../controller/change-user-password-controller";
import { changeUserEmailController } from "../controller/change-user-email-controller";
import { changeUserRoleController } from "../controller/change-user-role-controller";
import { profileController } from "../controller/profile-controller";
import { verifyJwt } from "../middleware/verify-jwt";
import { loginRequired } from "../middleware/login-required";

export function userRoutes(app: FastifyInstance) {
  app.post(
    "/user/register",
    {
      schema: {
        tags: ["Users"],
        summary: "Cadastrar novo usuário",
        description: "Cria um novo usuário na plataforma com role padrão Client.",
        body: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", maxLength: 50, example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", minLength: 6, example: "123456" },
          },
        },
        response: {
          201: {
            description: "Usuário registrado com sucesso",
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john@example.com" },
                  role: { type: "string", example: "Client" },
                },
              },
            },
          },
          409: {
            description: "E-mail de usuário já cadastrado",
            type: "object",
            properties: {
              message: { type: "string", example: "User already exists" },
            },
          },
        },
      },
    },
    registerUserController,
  );

  app.post(
    "/user/login",
    {
      schema: {
        tags: ["Users"],
        summary: "Autenticar usuário (Login)",
        description: "Autentica usuário com e-mail e senha, retornando token JWT para requisições subsequentes.",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", minLength: 6, example: "123456" },
          },
        },
        response: {
          200: {
            description: "Autenticação bem-sucedida",
            type: "object",
            properties: {
              token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            },
          },
          401: {
            description: "Credenciais inválidas",
            type: "object",
            properties: {
              message: { type: "string", example: "Invalid credentials" },
            },
          },
        },
      },
    },
    loginUserController,
  );

  app.patch(
    "/users/change-password",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Users"],
        summary: "Alterar senha do usuário autenticado",
        description: "Permite ao usuário autenticado alterar sua senha fornecendo a senha antiga e a nova.",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["oldPassword", "newPassword"],
          properties: {
            oldPassword: { type: "string", minLength: 6, example: "old123456" },
            newPassword: { type: "string", minLength: 6, example: "new123456" },
          },
        },
        response: {
          200: {
            description: "Senha alterada com sucesso",
            type: "object",
            properties: {
              message: { type: "string", example: "Password change successfully" },
            },
          },
          400: {
            description: "Nova senha idêntica à senha antiga ou dados inválidos",
            type: "object",
            properties: {
              message: { type: "string", example: "Same old credentials" },
            },
          },
          401: {
            description: "Não autorizado ou senha antiga incorreta",
            type: "object",
            properties: {
              message: { type: "string", example: "Invalid credentials" },
            },
          },
        },
      },
    },
    changeUserPasswordController,
  );

  app.patch(
    "/users/change-email",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Users"],
        summary: "Alterar e-mail do usuário autenticado",
        description: "Permite alterar o e-mail do usuário autenticado validando a senha atual.",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["password", "newEmail"],
          properties: {
            password: { type: "string", minLength: 6, example: "123456" },
            newEmail: { type: "string", format: "email", example: "newemail@example.com" },
          },
        },
        response: {
          201: {
            description: "E-mail alterado com sucesso",
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "newemail@example.com" },
                  role: { type: "string", example: "Client" },
                },
              },
            },
          },
          400: {
            description: "Novo e-mail idêntico ao atual",
            type: "object",
            properties: {
              message: { type: "string", example: "Same old credentials" },
            },
          },
          401: {
            description: "Senha incorreta ou não autorizado",
            type: "object",
            properties: {
              message: { type: "string", example: "Invalid credentials" },
            },
          },
          409: {
            description: "E-mail já em uso por outro usuário",
            type: "object",
            properties: {
              message: { type: "string", example: "User already exists" },
            },
          },
        },
      },
    },
    changeUserEmailController,
  );

  app.patch(
    "/users/change-role",
    {
      onRequest: [verifyJwt, loginRequired],
      schema: {
        tags: ["Users"],
        summary: "Alterar perfil de acesso (Role)",
        description: "Atualiza o papel do usuário (Client ou Seller).",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["role"],
          properties: {
            role: { type: "string", enum: ["Client", "Seller"], example: "Seller" },
          },
        },
        response: {
          200: {
            description: "Perfil alterado com sucesso",
            type: "object",
            properties: {
              message: { type: "string", example: "Change role successfuly" },
            },
          },
          401: {
            description: "Não autorizado",
            type: "object",
            properties: {
              message: { type: "string", example: "Unauthorized" },
            },
          },
        },
      },
    },
    changeUserRoleController,
  );

  app.get(
    "/me",
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ["Users"],
        summary: "Perfil do usuário logado",
        description: "Retorna as informações do perfil do usuário autenticado via token JWT.",
        security: [{ bearerAuth: [] }],
        response: {
          201: {
            description: "Dados do perfil retornados com sucesso",
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john@example.com" },
                  role: { type: "string", example: "Client" },
                },
              },
            },
          },
          401: {
            description: "Token inválido ou ausente",
            type: "object",
            properties: {
              message: { type: "string", example: "Unauthorized" },
            },
          },
        },
      },
    },
    profileController,
  );
}

