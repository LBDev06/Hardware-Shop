import { InMemoryUsersRepository } from "../../../../../test/repo/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { beforeEach, describe, expect, it } from "vitest";
import { makeUser } from "test/factories/makeUser";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to get a user profile", async () => {
    const user = await makeUser();

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      id: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user,
    });
  });

  it("should not be able to get a user profile with invalid id", async () => {
    const result = await sut.execute({
      id: "invalid-id",
    });

    expect(result.isLeft()).toBe(true);
  });
});
