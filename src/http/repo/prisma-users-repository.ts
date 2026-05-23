import { UsersRepository } from "@/domain/marketplace/app/repo/users-repository";
import { db } from "../libs/prisma";
import { PrismaUserMapper } from "@/mappers/prisma-user-mapper";
import { User } from "@/domain/marketplace/enterprise/entities/user";

export class PrismaUsersRepository implements UsersRepository {
  async create(user: User): Promise<User> {
    const createUser = await db.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return PrismaUserMapper.toDomain(createUser);
  }
}
