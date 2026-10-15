import {
  PERMISSIONS,
  ROLES,
  type AccessMethod,
  type CollaborationModel,
  type DeliveryTimeline,
  type EmployeeCountRange,
  type ExistingAsset,
  type ExpectedUsers,
  type FundingStatus,
  type IntegrationNeed,
  type InterestStatus,
  type InvestmentBudgetRange,
  type InvestmentHorizon,
  type InvestmentModel,
  type InvestmentStage,
  type InvestorInvolvement,
  type InvestorStatus,
  type InvestorType,
  type OpportunitySource,
  type OpportunityStatus,
  type Platform,
  type PreviousInvestments,
  type ProductType,
  type ProjectBudgetRange,
  type Sector,
  type SubmissionStage,
  type SubmissionStatus,
  type ApplicationStatus,
  type BillingType,
  type BranchStatus,
  type CiStatus,
  type ClientStatus,
  type DeveloperType,
  type ExperienceRange,
  type ExpertiseArea,
  type LeadStatus,
  type OwnerType,
  type PaymentMethod,
  type PaymentStage,
  type PaymentStatus,
  type PaymentTerms,
  type Permission,
  type Priority,
  type ProjectCategory,
  type ProjectStatus,
  type Role,
  type SeniorityLevel,
  type ServiceType,
  type StatusConfig,
  type SurveyStatus,
  type TrainingSource,
  type ThemePreference,
  type TrainingStatus,
  type WeeklyAvailability,
  type WorkModel,
} from '@/types'

export const APP = {
  name: 'Astra',
  companyName: 'Astra Yazılım Çözümleri',
  locale: 'tr-TR',
  currency: 'TRY',
  timeZone: 'Europe/Istanbul',
} as const

const LANDING_URL = import.meta.env.VITE_LANDING_URL ?? 'http://localhost:3000'

export const LANDING_LINKS = {
  investorApplication: `${LANDING_URL}/melek-yatirimci-basvurusu`,
  projectApplication: `${LANDING_URL}/bir-projem-var`,
} as const

export const ROUTE_PATHS = {
  login: '/login',
  forgotPassword: '/forgot-password',
  dashboard: '/',
  leadRequests: '/lead-requests',
  projects: '/projects',
  projectDetail: '/projects/:projectId',
  projectSubmissions: '/project-submissions',
  investors: '/investors',
  opportunities: '/opportunities',
  verifiedDevelopers: '/verified-developers',
  clients: '/clients',
  finance: '/finance',
  settings: '/settings',
} as const

export const PROJECT_BOARD_PARAMS = {
  search: 'search',
  category: 'category',
  owner: 'owner',
  project: 'project',
} as const

export const STORAGE_KEYS = {
  auth: 'astra-auth',
  ui: 'astra-ui',
  theme: 'astra-theme',
} as const

export const DB_TABLES = {
  users: 'users',
  projects: 'projects',
  leads: 'leads',
  developers: 'developers',
  applications: 'developer_applications',
  trainingModules: 'training_modules',
  trainingAssignments: 'training_assignments',
  clients: 'clients',
  surveys: 'surveys',
  finances: 'project_finances',
  investors: 'investors',
  opportunities: 'investment_opportunities',
  interests: 'investment_interests',
  submissions: 'project_submissions',
} as const

export const MOCK_LATENCY_MS = 350
export const QUERY_STALE_TIME_MS = 60_000
export const MOBILE_BREAKPOINT_PX = 768
export const UPCOMING_DEADLINE_DAYS = 14
export const NEW_CLIENT_VALUE = '__new_client__' as const
export const ALL_FILTER_VALUE = 'all' as const
export const NO_LINK_VALUE = '__none__' as const

export const THEME_LABELS: Record<ThemePreference, string> = {
  light: 'Açık',
  dark: 'Koyu',
  system: 'Sistem',
}

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Süper Yönetici',
  manager: 'Yönetici',
  core_developer: 'Çekirdek Ekip',
  verified_developer: 'Dış Kaynak Uzmanı',
  content_manager: 'İçerik Yöneticisi',
  investor: 'Melek Yatırımcı',
}

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  super_admin: 'Tüm modüllerde okuma, yazma ve silme; bütçe ve geliştirici ödemeleri dahil.',
  manager: 'Proje yönetimi, teklif hunisi, geliştirici onayı ve finansal özetler.',
  core_developer: 'Atanan projeler, teknik dokümanlar, GitHub notları ve iç görevler.',
  verified_developer: 'Yalnızca atanan görev kartları. Bütçe ve müşteri iletişim bilgileri gizli.',
  content_manager: 'Landing page, blog ve form içerikleri; teklif talepleri okuma/yazma.',
  investor: 'Yalnızca yatırıma açılan projelerin özetleri. Görülen tüm bilgiler gizlilik sözleşmesi kapsamındadır.',
}

export const PERMISSION_LABELS: Record<Permission, string> = {
  'dashboard:view': 'Genel bakış',
  'leads:view': 'Teklif taleplerini görüntüleme',
  'leads:write': 'Teklif taleplerini düzenleme',
  'projects:view': 'Projeleri görüntüleme',
  'projects:view_all': 'Tüm projeleri görüntüleme',
  'projects:write': 'Proje oluşturma / düzenleme',
  'projects:move': 'Kart durumunu değiştirme',
  'developers:view': 'Geliştirici ağını görüntüleme',
  'developers:approve': 'Başvuru onaylama',
  'academy:manage': 'Akademi yönetimi',
  'clients:view': 'Müşterileri görüntüleme',
  'clients:contact_view': 'Müşteri iletişim bilgileri',
  'surveys:send': 'Anket gönderme',
  'finance:view': 'Finansal özetler',
  'finance:payouts_view': 'Geliştirici ödemeleri',
  'finance:write': 'Ödeme kaydı',
  'submissions:view': 'Proje başvurularını görüntüleme',
  'submissions:review': 'Proje başvurularını değerlendirme',
  'investors:view': 'Yatırımcıları görüntüleme',
  'investors:approve': 'Yatırımcı onaylama ve erişim verme',
  'opportunities:manage': 'Yatırım fırsatlarını yönetme',
  'opportunities:browse': 'Yatırımcı portalı',
  'settings:view': 'Ayarlar',
  'settings:manage': 'Rol ve sistem yönetimi',
}

const ALL_PERMISSIONS = Object.values(PERMISSIONS)

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: ALL_PERMISSIONS,
  [ROLES.MANAGER]: ALL_PERMISSIONS.filter(
    (permission) =>
      permission !== PERMISSIONS.FINANCE_PAYOUTS_VIEW &&
      permission !== PERMISSIONS.FINANCE_WRITE &&
      permission !== PERMISSIONS.SETTINGS_MANAGE,
  ),
  [ROLES.CORE_DEVELOPER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.PROJECTS_MOVE,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  [ROLES.VERIFIED_DEVELOPER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.PROJECTS_MOVE,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  [ROLES.CONTENT_MANAGER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.LEADS_VIEW,
    PERMISSIONS.LEADS_WRITE,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  [ROLES.INVESTOR]: [PERMISSIONS.OPPORTUNITIES_BROWSE, PERMISSIONS.SETTINGS_VIEW],
}

export const PROJECT_STATUS_ORDER: ProjectStatus[] = ['backlog', 'in_progress', 'testing', 'uat', 'live']

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, StatusConfig> = {
  backlog: { label: 'Backlog', tone: 'neutral' },
  in_progress: { label: 'Devam Eden', tone: 'info' },
  testing: { label: 'Test / QA', tone: 'warning' },
  uat: { label: 'Müşteri Onayı', tone: 'gold' },
  live: { label: 'Canlı', tone: 'success' },
}

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  core_product: 'Kendi Ürünümüz',
  custom_web: 'WordPress / Özel Web',
  ecommerce_integration: 'Ticimax / ikas Entegrasyonu',
  mobile_app: 'Mobil Uygulama',
  ui_ux: 'UI/UX Yenileme',
  micro_task: 'Hata Düzeltme / Mikro Görev',
}

export const PRIORITY_CONFIG: Record<Priority, StatusConfig> = {
  low: { label: 'Düşük', tone: 'neutral' },
  medium: { label: 'Orta', tone: 'info' },
  high: { label: 'Yüksek', tone: 'warning' },
  critical: { label: 'Kritik', tone: 'danger' },
}

export const OWNER_TYPE_CONFIG: Record<OwnerType, StatusConfig> = {
  core_team: { label: 'Çekirdek Ekip', tone: 'primary' },
  developer_network: { label: 'Astra Ağı', tone: 'gold' },
}

export const SENIORITY_LABELS: Record<SeniorityLevel, string> = {
  junior: 'Junior',
  mid: 'Mid',
  senior: 'Senior',
}

export const BRANCH_STATUS_CONFIG: Record<BranchStatus, StatusConfig> = {
  up_to_date: { label: 'Güncel', tone: 'success' },
  ahead: { label: 'İleride', tone: 'info' },
  behind: { label: 'Geride', tone: 'warning' },
  conflict: { label: 'Çakışma', tone: 'danger' },
}

export const CI_STATUS_CONFIG: Record<CiStatus, StatusConfig> = {
  passing: { label: 'Başarılı', tone: 'success' },
  failing: { label: 'Başarısız', tone: 'danger' },
  running: { label: 'Çalışıyor', tone: 'info' },
  none: { label: 'Tanımlı değil', tone: 'neutral' },
}

export const LEAD_STATUS_ORDER: LeadStatus[] = ['new', 'reviewing', 'proposal_sent', 'accepted', 'rejected']

export const OPEN_LEAD_STATUSES: LeadStatus[] = ['new', 'reviewing', 'proposal_sent']

export const LEAD_STATUS_CONFIG: Record<LeadStatus, StatusConfig> = {
  new: { label: 'Yeni', tone: 'primary' },
  reviewing: { label: 'İncelemede', tone: 'info' },
  proposal_sent: { label: 'Teklif İletildi', tone: 'gold' },
  accepted: { label: 'Kabul Edildi', tone: 'success' },
  rejected: { label: 'Reddedildi', tone: 'danger' },
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  ecommerce_setup: 'E-ticaret kurulumu',
  marketplace_integration: 'Ticimax / ikas / Pazaryeri entegrasyonu',
  custom_web: 'Kurumsal / özel web sitesi',
  mobile_app: 'Mobil uygulama',
  ui_ux: 'UI/UX tasarım',
  bug_fix: 'Hata düzeltme / bakım',
  core_product: 'Hazır ürün (eŞube)',
}

export const SERVICE_CATEGORY_MAP: Record<ServiceType, ProjectCategory> = {
  ecommerce_setup: 'ecommerce_integration',
  marketplace_integration: 'ecommerce_integration',
  custom_web: 'custom_web',
  mobile_app: 'mobile_app',
  ui_ux: 'ui_ux',
  bug_fix: 'micro_task',
  core_product: 'core_product',
}

export const DEVELOPER_TYPE_CONFIG: Record<DeveloperType, StatusConfig> = {
  core: { label: 'Çekirdek Ekip', tone: 'primary' },
  network: { label: 'Doğrulanmış Uzman', tone: 'gold' },
}

export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = ['received', 'reviewing', 'interview', 'approved', 'rejected']

export const APPLICATION_STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  received: { label: 'Başvuru Alındı', tone: 'primary' },
  reviewing: { label: 'GitHub / LinkedIn İnceleme', tone: 'info' },
  interview: { label: 'Görüşme Planlandı', tone: 'gold' },
  approved: { label: 'Onaylandı', tone: 'success' },
  rejected: { label: 'Reddedildi', tone: 'danger' },
}

export const EXPERTISE_LABELS: Record<ExpertiseArea, string> = {
  ikas: 'ikas',
  ticimax: 'Ticimax',
  shopify: 'Shopify',
  woocommerce: 'WooCommerce',
  marketplace: 'Pazaryeri entegrasyonları',
  frontend: 'Frontend (React, Next.js)',
  backend: 'Backend (Node.js, API)',
  mobile: 'Mobil (React Native)',
  ai_automation: 'Yapay zeka ve otomasyon',
  ui_ux: 'UI/UX tasarım',
  seo_performance: 'SEO ve performans',
  devops_cloud: 'DevOps ve bulut',
}

export const EXPERIENCE_LABELS: Record<ExperienceRange, string> = {
  '0_1': '0-1 yıl',
  '1_3': '1-3 yıl',
  '3_5': '3-5 yıl',
  '5_8': '5-8 yıl',
  '8_plus': '8+ yıl',
}

export const WORK_MODEL_LABELS: Record<WorkModel, string> = {
  fixed_price: 'İş bitirme',
  weekly: 'Haftalık',
  monthly: 'Aylık',
}

export const WEEKLY_AVAILABILITY_LABELS: Record<WeeklyAvailability, string> = {
  under_10: '10 saatten az',
  '10_20': '10-20 saat',
  '20_30': '20-30 saat',
  full_time: '30+ saat (tam zamanlı)',
}

export const TRAINING_STATUS_CONFIG: Record<TrainingStatus, StatusConfig> = {
  assigned: { label: 'Atandı', tone: 'neutral' },
  in_progress: { label: 'Devam Ediyor', tone: 'info' },
  completed: { label: 'Tamamlandı', tone: 'success' },
}

export const TRAINING_SOURCE_LABELS: Record<TrainingSource, string> = {
  client_feedback: 'Müşteri geri bildirimi',
  internal_review: 'İç değerlendirme',
}

export const CLIENT_STATUS_CONFIG: Record<ClientStatus, StatusConfig> = {
  active: { label: 'Aktif', tone: 'success' },
  inactive: { label: 'Pasif', tone: 'neutral' },
}

export const SURVEY_STATUS_CONFIG: Record<SurveyStatus, StatusConfig> = {
  sent: { label: 'Yanıt Bekleniyor', tone: 'gold' },
  completed: { label: 'Yanıtlandı', tone: 'success' },
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  bank_transfer: 'Havale / EFT',
  credit_card: 'Kredi Kartı',
  credit_purchase: 'Kredi Satın Alımı',
}

export const PAYMENT_STAGE_LABELS: Record<PaymentStage, string> = {
  advance: 'Peşin',
  milestone: 'Ara Teslim',
  final: 'Final Onayı',
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, StatusConfig> = {
  paid: { label: 'Ödendi', tone: 'success' },
  pending: { label: 'Bekliyor', tone: 'neutral' },
  overdue: { label: 'Gecikmiş', tone: 'danger' },
}

export const BILLING_TYPE_LABELS: Record<BillingType, string> = {
  fixed: 'Sabit Bütçe',
  credit: 'Kredi Birimi',
}

export const DEFAULT_PAYMENT_TERMS: PaymentTerms = { advance: 40, milestone: 30, final: 30 }
export const DEFAULT_COMMISSION_RATE = 0.25
export const CREDIT_UNIT_PRICE = 1_250

export const SURVEY_SCORE_WEIGHTS = { overall: 0.5, communication: 0.25, technical: 0.25 } as const
export const MAX_RATING = 5

export const CV_ACCEPTED_EXTENSIONS = ['pdf', 'doc', 'docx'] as const
export const CV_MAX_SIZE_MB = 3

export const SECTOR_LABELS: Record<Sector, string> = {
  ecommerce: 'E-ticaret',
  retail: 'Perakende',
  fintech: 'Finans / Fintech',
  saas: 'SaaS / Yazılım',
  health: 'Sağlık',
  education: 'Eğitim',
  logistics: 'Lojistik',
  tourism: 'Turizm',
  manufacturing: 'Üretim / Sanayi',
  agriculture: 'Tarım / Gıda',
  media: 'Medya / Eğlence',
  real_estate: 'Gayrimenkul / İnşaat',
  energy: 'Enerji',
  other: 'Diğer',
}

export const ONE_TIME_PASSWORD_LENGTH = 8
export const ACCESS_VALIDITY_HOURS = 48
export const REFERRAL_COMMISSION_RATE = 0.1

export const INVESTOR_STATUS_ORDER: InvestorStatus[] = ['received', 'reviewing', 'meeting', 'approved', 'rejected']

export const INVESTOR_STATUS_CONFIG: Record<InvestorStatus, StatusConfig> = {
  received: { label: 'Başvuru Alındı', tone: 'primary' },
  reviewing: { label: 'Doğrulama', tone: 'info' },
  meeting: { label: 'Görüşme', tone: 'gold' },
  approved: { label: 'Onaylandı', tone: 'success' },
  rejected: { label: 'Reddedildi', tone: 'danger' },
}

export const INVESTOR_TYPE_LABELS: Record<InvestorType, string> = {
  individual: 'Bireysel melek yatırımcı',
  corporate: 'Kurumsal (şirket adına)',
  angel_network: 'Melek yatırım ağı üyesi',
  family_office: 'Aile ofisi',
  fund: 'Girişim sermayesi fonu',
}

export const EMPLOYEE_COUNT_LABELS: Record<EmployeeCountRange, string> = {
  '1_10': '1-10',
  '11_50': '11-50',
  '51_200': '51-200',
  '201_1000': '201-1.000',
  '1000_plus': '1.000+',
}

export const INVESTMENT_BUDGET_LABELS: Record<InvestmentBudgetRange, string> = {
  '250k_1m': '250.000 – 1.000.000 ₺',
  '1m_5m': '1.000.000 – 5.000.000 ₺',
  '5m_20m': '5.000.000 – 20.000.000 ₺',
  '20m_plus': '20.000.000 ₺ +',
}

export const INVESTMENT_HORIZON_LABELS: Record<InvestmentHorizon, string> = {
  under_1y: '1 yıldan kısa',
  '1_3y': '1-3 yıl',
  '3_5y': '3-5 yıl',
  '5y_plus': '5 yıl +',
}

export const INVESTMENT_STAGE_LABELS: Record<InvestmentStage, string> = {
  idea: 'Fikir',
  mvp: 'MVP / Prototip',
  early_revenue: 'İlk gelir',
  growth: 'Büyüme',
}

export const INVOLVEMENT_LABELS: Record<InvestorInvolvement, string> = {
  passive: 'Pasif (yalnızca finansman)',
  mentor: 'Mentorluk / danışmanlık',
  active: 'Aktif (yönetim kurulu / operasyon)',
}

export const PREVIOUS_INVESTMENTS_LABELS: Record<PreviousInvestments, string> = {
  none: 'Henüz yok',
  '1_3': '1-3 yatırım',
  '4_10': '4-10 yatırım',
  '10_plus': '10+ yatırım',
}

export const ACCESS_METHOD_LABELS: Record<AccessMethod, string> = {
  one_time_password: 'Tek kullanımlık şifre',
  password_setup_link: 'Şifre belirleme bağlantısı',
}

export const OPPORTUNITY_STATUS_CONFIG: Record<OpportunityStatus, StatusConfig> = {
  draft: { label: 'Taslak', tone: 'neutral' },
  open: { label: 'Yatırıma Açık', tone: 'success' },
  closed: { label: 'Kapandı', tone: 'info' },
}

export const OPPORTUNITY_SOURCE_LABELS: Record<OpportunitySource, string> = {
  internal_product: 'Kendi ürünümüz',
  client_project: 'Müşteri projesi',
  project_submission: 'Proje başvurusu',
}

export const INVESTMENT_MODEL_LABELS: Record<InvestmentModel, string> = {
  equity: 'Hisse karşılığı',
  revenue_share: 'Gelir paylaşımı',
  convertible: 'Dönüştürülebilir not',
}

export const INTEREST_STATUS_CONFIG: Record<InterestStatus, StatusConfig> = {
  new: { label: 'Yeni', tone: 'primary' },
  in_discussion: { label: 'Görüşülüyor', tone: 'info' },
  committed: { label: 'Taahhüt Edildi', tone: 'success' },
  declined: { label: 'Vazgeçildi', tone: 'neutral' },
}

export const SUBMISSION_STATUS_ORDER: SubmissionStatus[] = ['received', 'technical_review', 'meeting', 'approved', 'rejected']

export const SUBMISSION_STATUS_CONFIG: Record<SubmissionStatus, StatusConfig> = {
  received: { label: 'Başvuru Alındı', tone: 'primary' },
  technical_review: { label: 'Teknik İnceleme', tone: 'info' },
  meeting: { label: 'Görüşme / Teklif', tone: 'gold' },
  approved: { label: 'Onaylandı', tone: 'success' },
  rejected: { label: 'Reddedildi', tone: 'danger' },
}

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  web: 'Web uygulaması',
  mobile: 'Mobil uygulama',
  ecommerce: 'E-ticaret',
  saas: 'SaaS ürün',
  internal_tool: 'Kurum içi yazılım',
  ai: 'Yapay zeka çözümü',
  other: 'Diğer',
}

export const PRODUCT_TYPE_CATEGORY_MAP: Record<ProductType, ProjectCategory> = {
  web: 'custom_web',
  mobile: 'mobile_app',
  ecommerce: 'ecommerce_integration',
  saas: 'custom_web',
  internal_tool: 'custom_web',
  ai: 'custom_web',
  other: 'custom_web',
}

export const SUBMISSION_STAGE_LABELS: Record<SubmissionStage, string> = {
  idea: 'Fikir aşamasında',
  designed: 'Tasarımı / analizi hazır',
  in_development: 'Geliştirme sürüyor',
  stalled: 'Yarım kaldı',
  live: 'Canlıda, geliştirilmesi gerekiyor',
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  web: 'Web',
  ios: 'iOS',
  android: 'Android',
  admin_panel: 'Yönetim paneli',
  desktop: 'Masaüstü',
}

export const EXISTING_ASSET_LABELS: Record<ExistingAsset, string> = {
  requirements: 'Gereksinim / analiz dokümanı',
  design: 'UI tasarımları (Figma vb.)',
  source_code: 'Kaynak kod',
  live_environment: 'Canlı ortam',
  test_environment: 'Test ortamı',
  documentation: 'Teknik dokümantasyon',
}

export const INTEGRATION_LABELS: Record<IntegrationNeed, string> = {
  payment: 'Ödeme (iyzico, PayTR…)',
  erp: 'ERP / muhasebe (Logo, Mikro…)',
  marketplace: 'Pazaryeri',
  cargo: 'Kargo',
  sms_email: 'SMS / e-posta',
  maps: 'Harita / konum',
  ai: 'Yapay zeka servisleri',
  sso: 'Kurumsal giriş (SSO)',
}

export const EXPECTED_USERS_LABELS: Record<ExpectedUsers, string> = {
  under_1k: 'Aylık 1.000 kullanıcıdan az',
  '1k_10k': 'Aylık 1.000 – 10.000',
  '10k_100k': 'Aylık 10.000 – 100.000',
  '100k_plus': 'Aylık 100.000 +',
}

export const PROJECT_BUDGET_LABELS: Record<ProjectBudgetRange, string> = {
  under_100k: '100.000 ₺ altı',
  '100k_250k': '100.000 – 250.000 ₺',
  '250k_500k': '250.000 – 500.000 ₺',
  '500k_1m': '500.000 – 1.000.000 ₺',
  '1m_plus': '1.000.000 ₺ +',
  undecided: 'Henüz belirlenmedi',
}

export const DELIVERY_TIMELINE_LABELS: Record<DeliveryTimeline, string> = {
  asap: 'En kısa sürede',
  '1_3_months': '1-3 ay',
  '3_6_months': '3-6 ay',
  '6_plus_months': '6 ay +',
  flexible: 'Esnek',
}

export const FUNDING_STATUS_LABELS: Record<FundingStatus, string> = {
  self_funded: 'Öz kaynak',
  seeking: 'Yatırım arıyorum',
  funded: 'Yatırım aldı',
  grant: 'Hibe / destek (KOSGEB, TÜBİTAK…)',
}

export const COLLABORATION_MODEL_LABELS: Record<CollaborationModel, string> = {
  continue_existing: 'Yarım kalan projemi devralın',
  build_from_scratch: 'Sıfırdan geliştirin',
  referral: 'Referans oluyorum (komisyon)',
  partnership: 'Ortaklık / gelir paylaşımı',
}
