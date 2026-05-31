import { User } from "@/domain/marketplace/enterprise/entities/user";
import { Role } from "@/domain/marketplace/enterprise/value-objects/role";
import { UniqueEntityId } from "@/core/unique-entity-id";

type PrismaUserRole = "Client" | "Seller";

export class PrismaUserMapper {
  static toPrisma(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role.value as PrismaUserRole,
    };
  }

  static toDomain(raw: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: PrismaUserRole;
    createdAt: Date;
  }): User {
    return new User(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: Role.fromString(raw.role),
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    );
  }
}
