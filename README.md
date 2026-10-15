# Astra Yönetim Paneli

React 19 · TypeScript (strict) · Vite · Tailwind v4 · shadcn/ui · TanStack Query · Zustand · React Hook Form + Zod

## Başlangıç

```bash
nvm use          # Node 20.19+
npm install
npm run dev
```

Demo hesaplar giriş ekranında listelenir (şifre: `astra2026`).

| Rol | E-posta |
| --- | --- |
| Süper Yönetici | selin@astrayazilim.com |
| Yönetici | murat@astrayazilim.com |
| Çekirdek Ekip | ece@astrayazilim.com |
| Dış Kaynak Uzmanı | burak.sahin@gmail.com |
| İçerik Yöneticisi | zeynep@astrayazilim.com |
| Melek Yatırımcı | ahmet.karahan@karahanholding.com |

## Başvuru formları (landing sitesinde)

Melek yatırımcı ve "Bir projem var" formları landing projesinde yer alır; panel yalnızca gelen başvuruları değerlendirir. Form linkleri `VITE_LANDING_URL` üzerinden oluşturulur.

Alanlar, seçenek değerleri ve gönderilen payload iki proje arasındaki veri sözleşmesidir: `docs/landing-prompts/`.

Yatırımcı onaylandığında panelde tek kullanımlık şifre veya şifre belirleme bağlantısı üretilir; yatırımcı yalnızca **Yatırımcı Portalı**'nı (`/opportunities`) görür.

## Kurallar

- Metinler `src/utils/validations/messages.ts`, durum/rozet/seçenek tanımları `src/utils/validations/constants.ts` içinde.
- Roller ve yetkiler: `src/types/role.ts` + `ROLE_PERMISSIONS` (constants). Route koruması `src/router/protected-route.tsx`, menü `src/router/menu.ts`.
- Bileşen stilleri kendi klasöründe `*.module.css` olarak; Tailwind sınıfları `@reference "@/index.css"` + `@apply` ile kullanılır. `src/components/ui` shadcn CLI tarafından yönetilir.
- Sayfaya özel bileşenler `src/pages/<modül>/components/<bileşen>/` altında.

## Supabase geçişi

Tüm servisler `src/services/http/index.ts` içindeki `createRepository` üzerinden veri okur. Şu an mock (`src/mock`) döner; Supabase için aynı `Repository<T>` arayüzünü uygulayan bir `supabase-repository.ts` yazıp `createRepository`'yi ona yönlendirmek yeterli. Tablo adları `DB_TABLES` sabitinde.
