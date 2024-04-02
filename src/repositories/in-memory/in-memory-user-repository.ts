import { Prisma, User } from "@prisma/client";
import { UsersRespository } from "../users-repository";
import { randomUUID } from "node:crypto";

export class inMemoryUsersRepository implements UsersRespository {
  public items: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((items) => items.email === email);

    if (!user) return null;

    return user;
  }

  async create({
    name,
    email,
    password_hash,
  }: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name,
      email,
      password_hash,
      created_at: new Date(),
    };

    this.items.push(user);

    return user;
  }
}
