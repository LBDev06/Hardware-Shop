import { User } from "@/domain/marketplace/enterprise/entities/user";

export class PrismaUserMapper {
  static toPrisma(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
    };
  }

  static toDomain(raw: any): User {
    return new User(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
