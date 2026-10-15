import type { Entity } from '@/types'
import { createMockRepository } from './mock-repository'
import type { Repository } from './repository'

export function createRepository<T extends Entity>(table: string, seed: T[]): Repository<T> {
  return createMockRepository(table, seed)
}

export { HttpError } from './http-error'
export type { CreateInput, Repository, UpdateInput } from './repository'
