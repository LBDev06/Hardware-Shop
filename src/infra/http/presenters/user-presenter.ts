import { User } from "@/domain/marketplace/enterprise/entities/user";

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
