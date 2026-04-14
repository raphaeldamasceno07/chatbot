// No arquivo: src/repositories/users-repository.ts
import type { User } from '@/models/user-model.js'

// No seu arquivo de repositório
export type UserCreateInput = Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_seen' | 'is_online'> & {
  avatar?: string | null
}

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: UserCreateInput): Promise<User>
}