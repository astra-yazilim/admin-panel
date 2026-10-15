import type { User } from '@/types'

export const DEMO_PASSWORD = 'astra2026'

export const MOCK_USERS: User[] = [
  {
    id: 'usr-001',
    fullName: 'Selin Aydın',
    email: 'selin@astrayazilim.com',
    role: 'super_admin',
    title: 'Kurucu Ortak',
    createdAt: '2024-02-01T09:00:00.000Z',
  },
  {
    id: 'usr-002',
    fullName: 'Murat Kaya',
    email: 'murat@astrayazilim.com',
    role: 'manager',
    title: 'Operasyon Müdürü',
    createdAt: '2024-05-12T09:00:00.000Z',
  },
  {
    id: 'usr-003',
    fullName: 'Ece Demir',
    email: 'ece@astrayazilim.com',
    role: 'core_developer',
    title: 'Senior Frontend Developer',
    developerId: 'dev-001',
    createdAt: '2024-06-03T09:00:00.000Z',
  },
  {
    id: 'usr-004',
    fullName: 'Burak Şahin',
    email: 'burak.sahin@gmail.com',
    role: 'verified_developer',
    title: 'Frontend & Shopify Developer',
    developerId: 'dev-005',
    createdAt: '2025-03-18T09:00:00.000Z',
  },
  {
    id: 'usr-005',
    fullName: 'Zeynep Arslan',
    email: 'zeynep@astrayazilim.com',
    role: 'content_manager',
    title: 'İçerik ve Pazarlama Sorumlusu',
    createdAt: '2025-01-09T09:00:00.000Z',
  },
  {
    id: 'usr-006',
    fullName: 'Ahmet Karahan',
    email: 'ahmet.karahan@karahanholding.com',
    role: 'investor',
    title: 'Yönetim Kurulu Üyesi, Karahan Holding',
    investorId: 'inv-001',
    createdAt: '2026-09-02T09:00:00.000Z',
  },
]
