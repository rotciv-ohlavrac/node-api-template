import { describe, it, expect } from "vitest";
import { RegisterUserUseCase } from "./register";
import { compare } from "bcryptjs";
import { inMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register Use Case", () => {
  it("should be able to register", async () => {
    const usersRespository = new inMemoryUsersRepository();
    const registerUserCase = new RegisterUserUseCase(usersRespository);

    const { user } = await registerUserCase.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRespository = new inMemoryUsersRepository();
    const registerUserCase = new RegisterUserUseCase(usersRespository);

    const userPassword = "123456";

    const { user } = await registerUserCase.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: userPassword,
    });

    const isPasswordCorrectlyHashed = await compare(
      userPassword,
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should hash user password upon registration", async () => {
    const usersRespository = new inMemoryUsersRepository();
    const registerUserCase = new RegisterUserUseCase(usersRespository);

    const email = "johndoe@example.com";

    await registerUserCase.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      registerUserCase.execute({
        name: "John Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
