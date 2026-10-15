import { MutationCache, QueryClient } from '@tanstack/react-query'
import { QUERY_STALE_TIME_MS } from '@/utils/validations/constants'
import { showToast } from './show-toast'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME_MS,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
  mutationCache: new MutationCache({
    onError: (error) => showToast.error(error),
  }),
})

export const queryKeys = {
  users: ['users'] as const,
  projects: (assigneeId?: string) => ['projects', { assigneeId }] as const,
  allProjects: ['projects'] as const,
  leads: ['leads'] as const,
  developers: ['developers'] as const,
  applications: ['developer-applications'] as const,
  trainingModules: ['training-modules'] as const,
  trainingAssignments: ['training-assignments'] as const,
  clients: ['clients'] as const,
  surveys: ['surveys'] as const,
  finances: ['finances'] as const,
  investors: ['investors'] as const,
  opportunities: ['opportunities'] as const,
  publishedOpportunities: ['opportunities', 'published'] as const,
  interests: ['interests'] as const,
  myInterests: (investorId?: string) => ['interests', 'investor', investorId] as const,
  submissions: ['project-submissions'] as const,
}
