import { InMemoryUsersRepository } from "../../../../../test/repo/in-memory-users-repository";
import { beforeEach, describe, it, expect } from "vitest";
import { makeUser } from "test/factories/makeUser";
import { ChangeUserPasswordUseCase } from "./change-user-password";
import { FakeBcrypt } from "test/repo/fake-bcrypt";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeBcrypt: FakeBcrypt;
let sut: ChangeUserPasswordUseCase;

describe("Change Password Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeBcrypt = new FakeBcrypt();
    sut = new ChangeUserPasswordUseCase(
      inMemoryUsersRepository,
      fakeBcrypt,
    );
  });

  it("should be able to change password.", async () => {
    const user = await makeUser({
      password: await fakeBcrypt.hash("senha1", 7),
    });

    await inMemoryUsersRepository.create(user);

    const changePassword = await sut.execute({
      userId: user.id.toString(),
      oldPassword: "senha1",
      newPassword: "senha2",
    });

    expect(changePassword).toBeRight();
  });

  it("should not be able to change password with invalid credentials.", async () => {
    const user = await makeUser({
      password: await fakeBcrypt.hash("senha1", 7),
    });

    await inMemoryUsersRepository.create(user);

    const changePassword = await sut.execute({
      userId: user.id.toString(),
      oldPassword: "senha2",
      newPassword: "senha2",
    });

    expect(changePassword).toBeLeft();
  });

  it("should not be able to change new password with same credentials old.", async () => {
    const user = await makeUser({
      password: await fakeBcrypt.hash("senha2", 7),
    });

    await inMemoryUsersRepository.create(user);

    const changePassword = await sut.execute({
      userId: user.id.toString(),
      oldPassword: "senha2",
      newPassword: "senha2",
    });

    expect(changePassword).toBeLeft();
  });
});
