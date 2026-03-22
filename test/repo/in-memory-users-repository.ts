import { UsersRepository } from "@/domain/marketplace/app/repo/users-repository";
import { User } from '../../src/domain/marketplace/enterprise/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  public user: User[] = []

  async create(user: User): Promise<User> {
    this.user.push(user)
    return user
  }

    async findByEmail(email: string): Promise<User | null> {
        const user = this.user.find(user => user.email === email)
        if(!user){
            return null
        }
        return user
    }

}