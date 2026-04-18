import type { User } from '@/models/user-model.js'
import { randomUUID } from 'node:crypto'
import type { UserCreateInput, UsersRepository } from '../users-repository.js'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)
    return user || null
  }

  async create(data: UserCreateInput): Promise<User> {
    const user: User = {
      ...data,
      id: randomUUID(),
      is_online: false,
      last_seen: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      avatar: data.avatar ?? null,
    }

    this.items.push(user)
    return user
  }
}
