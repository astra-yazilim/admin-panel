import { z } from 'zod'
import type { OwnerType, Priority, ProjectCategory, SeniorityLevel } from '@/types'
import {
  OWNER_TYPE_CONFIG,
  PRIORITY_CONFIG,
  PROJECT_CATEGORY_LABELS,
  SENIORITY_LABELS,
} from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import { keysOf } from './schema-helpers'

export const projectSchema = z
  .object({
    title: z.string().trim().min(5, messages.validation.minLength(5)),
    description: z.string().trim().min(10, messages.validation.minLength(10)),
    problemStatement: z.string().trim(),
    clientId: z.string().min(1, messages.validation.required),
    category: z.enum(keysOf<ProjectCategory>(PROJECT_CATEGORY_LABELS)),
    priority: z.enum(keysOf<Priority>(PRIORITY_CONFIG)),
    ownerType: z.enum(keysOf<OwnerType>(OWNER_TYPE_CONFIG)),
    assigneeLevel: z.enum(keysOf<SeniorityLevel>(SENIORITY_LABELS)),
    assigneeIds: z.array(z.string()),
    startDate: z.string().min(1, messages.validation.required),
    dueDate: z.string().min(1, messages.validation.required),
    repositoryUrl: z.union([z.literal(''), z.string().url(messages.validation.url)]),
    branch: z.string().trim(),
    tags: z.string(),
  })
  .refine((values) => values.dueDate >= values.startDate, {
    path: ['dueDate'],
    message: messages.validation.dueDateBeforeStart,
  })

export type ProjectFormValues = z.infer<typeof projectSchema>
