import { UsersRepository } from "@/domain/marketplace/app/repo/users-repository";
import { User } from '../../src/domain/marketplace/enterprise/entities/user'
import { UniqueEntityId } from "@/core/unique-entity-id";

export class InMemoryUsersRepository implements UsersRepository {
  public user: User[] = []

  async create(user: User): Promise<User> {
    this.user.push(user)
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.user.find(user => user.email === email)
    if (!user) {
      return null
    }
    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.user.find(user => user.id.toString() === id)
    if (!user) {
      return null
    }
    return user
  }

  async save<T>(userId: UniqueEntityId, props?: T): Promise<void> {
    const userIndex = this.user.findIndex(
      (user) => user.id.toString() === userId.toString()
    );

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    if (props) {
      Object.assign(this.user[userIndex], props);
    }
  }

}