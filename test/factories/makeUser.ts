import { User, UserProps } from "@/domain/marketplace/enterprise/entities/user"
import { hash } from "bcryptjs"

export async function makeUser(override: Partial<UserProps> = {}) {
    const passwordHash = '123123123'

    const user = User.create({
        name: 'Alberto',
        email: 'Alberto1243@gmail.com',
        password: await hash(passwordHash, 7), 
        createdAt: new Date(),
        ...override
    })

    return user
}