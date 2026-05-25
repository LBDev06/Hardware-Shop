import { UsersRepository } from "@/domain/marketplace/app/repo/users-repository";
import { db } from "../libs/prisma";
import { PrismaUserMapper } from "@/infra/db/mappers/prisma-user-mapper";
import { User } from "@/domain/marketplace/enterprise/entities/user";
import { UniqueEntityId } from "@/core/unique-entity-id";

export class PrismaUsersRepository implements UsersRepository {
  async create(user: User): Promise<User> {
    const createUser = await db.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return PrismaUserMapper.toDomain(createUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEmail = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userEmail) return null;

    return PrismaUserMapper.toDomain(userEmail);
  }

  findById(id: string): Promise<User | null> {}

  save<T>(userId: UniqueEntityId, props?: T): Promise<void> {}
}
