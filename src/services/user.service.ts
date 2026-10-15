import { MOCK_USERS } from '@/mock/users.mock'
import type { Role, User } from '@/types'
import { DB_TABLES } from '@/utils/validations/constants'
import { createRepository } from './http'

const repository = createRepository<User>(DB_TABLES.users, MOCK_USERS)

export const userService = {
  list: () => repository.list(),
  findByEmail: async (email: string) => {
    const users = await repository.list()
    return users.find((user) => user.email.toLocaleLowerCase() === email.toLocaleLowerCase())
  },
  create: (input: Omit<User, 'id'>) => repository.create(input),
  updateRole: (id: string, role: Role) => repository.update(id, { role }),
}
