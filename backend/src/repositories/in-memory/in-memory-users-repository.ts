import type { IUser } from '@/models/user-model.js'
import { randomUUID } from 'node:crypto'
import type { UserCreateInput, UsersRepository } from '../users-repository.js'

export class InMemoryUsersRepository implements UsersRepository {
  public items: IUser[] = []

  async findByEmail(email: string): Promise<IUser | null> {
    const user = this.items.find((item) => item.email === email)
    return user || null
  }

  async findById(id: string): Promise<IUser | null> {
    const user = this.items.find((item) => item.id === id)
    return user || null
  }

  async create(data: UserCreateInput): Promise<IUser> {
    const user: IUser = {
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
