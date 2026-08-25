import { describe, expect, it } from "vitest";
import { PrismaQuestionMapper } from "./prisma-question-mapper";
import { makeQuestion } from "test/factories/makeQuestion";
import { UniqueEntityId } from "@/core/unique-entity-id";

describe("PrismaQuestionMapper", () => {
  it("should map domain Question to Prisma Question object", async () => {
    const question = await makeQuestion({
      authorId: new UniqueEntityId("author-1"),
      productId: new UniqueEntityId("product-1"),
      content: "Qual a voltagem?",
      updatedAt: new Date("2026-08-20T10:00:00Z"),
    });

    const prismaQuestion = PrismaQuestionMapper.toPrisma(question);

    expect(prismaQuestion).toEqual({
      id: question.id.toString(),
      authorId: "author-1",
      productId: "product-1",
      content: "Qual a voltagem?",
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    });
  });

  it("should map raw Prisma Question to domain Question entity", () => {
    const raw = {
      id: "question-1",
      authorId: "author-1",
      productId: "product-1",
      content: "Qual a voltagem?",
      createdAt: new Date("2026-08-15T18:00:00Z"),
      updatedAt: new Date("2026-08-20T10:00:00Z"),
    };

    const question = PrismaQuestionMapper.toDomain(raw);

    expect(question.id.toString()).toBe("question-1");
    expect(question.authorId.toString()).toBe("author-1");
    expect(question.productId.toString()).toBe("product-1");
    expect(question.content).toBe("Qual a voltagem?");
    expect(question.createdAt).toEqual(new Date("2026-08-15T18:00:00Z"));
    expect(question.updatedAt).toEqual(new Date("2026-08-20T10:00:00Z"));
  });
});
