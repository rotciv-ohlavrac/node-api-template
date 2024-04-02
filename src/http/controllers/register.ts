import { FastifyRequest, FastifyReply } from "fastify";
import { RegisterUserUseCase } from "@/use-cases/register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  const prismaUsersRepository = new PrismaUsersRepository();
  const registerUserUseCase = new RegisterUserUseCase(prismaUsersRepository);

  await registerUserUseCase.execute({ email, name, password });

  return reply.status(201).send();
}
