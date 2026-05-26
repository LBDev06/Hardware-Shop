import { InMemoryUsersRepository } from "../../../../../test/repo/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { makeUser } from "test/factories/makeUser";
import { LoginUseCase } from "./login";
import { FakeBcrypt } from "test/repo/fake-bcrypt";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHashComparer: FakeBcrypt;
let sut: LoginUseCase;

describe("Login Use Case", () => {
  beforeEach(() => {
    ((inMemoryUsersRepository = new InMemoryUsersRepository()),
      (fakeHashComparer = new FakeBcrypt()),
      (sut = new LoginUseCase(inMemoryUsersRepository, fakeHashComparer)));
  });

  it("should be able to login.", async () => {
    const password = "senha124124124";

    const user = await makeUser({
      password: password,
    });

    await inMemoryUsersRepository.create(user);

    const login = await sut.execute({
      email: user.email,
      password: password,
    });

    expect(login).toBeRight();
  });

  it("should be not able to login with invalid credentials.", async () => {
    const password = "senha124124124";

    const user = await makeUser({
      password: password,
    });

    await inMemoryUsersRepository.create(user);

    const login = await sut.execute({
      email: "Alberto00@gmail.com",
      password: password,
    });

    expect(login).toBeLeft();
  });
});
