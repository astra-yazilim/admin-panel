import type { Entity } from '@/types'
import { MOCK_LATENCY_MS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import { HttpError } from './http-error'
import type { CreateInput, Repository, UpdateInput } from './repository'

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))

const createId = (table: string) => `${table}-${crypto.randomUUID().slice(0, 8)}`

export function createMockRepository<T extends Entity>(table: string, seed: T[]): Repository<T> {
  let records = structuredClone(seed)

  const findOrThrow = (id: string) => {
    const record = records.find((item) => item.id === id)
    if (!record) throw new HttpError(messages.errors.notFound, 404)
    return record
  }

  return {
    async list() {
      await wait()
      return structuredClone(records)
    },
    async getById(id) {
      await wait()
      return structuredClone(findOrThrow(id))
    },
    async create(input: CreateInput<T>) {
      await wait()
      const record = { ...input, id: createId(table) } as T
      records = [record, ...records]
      return structuredClone(record)
    },
    async update(id, input: UpdateInput<T>) {
      await wait()
      const updated = { ...findOrThrow(id), ...input }
      records = records.map((item) => (item.id === id ? updated : item))
      return structuredClone(updated)
    },
    async remove(id) {
      await wait()
      findOrThrow(id)
      records = records.filter((item) => item.id !== id)
    },
  }
}
