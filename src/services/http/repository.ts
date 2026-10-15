import type { Entity } from '@/types'

export type CreateInput<T extends Entity> = Omit<T, 'id'>

export type UpdateInput<T extends Entity> = Partial<Omit<T, 'id'>>

export interface Repository<T extends Entity> {
  list(): Promise<T[]>
  getById(id: string): Promise<T>
  create(input: CreateInput<T>): Promise<T>
  update(id: string, input: UpdateInput<T>): Promise<T>
  remove(id: string): Promise<void>
}
