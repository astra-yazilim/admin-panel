# Prompt: "Bir Projem Var" Başvuru Sayfası

Astra Yazılım Çözümleri landing sitesine **"Bir Projem Var"** başvuru sayfası ekle. Bu sayfa şu kişiler için:
- Fikrini hayata geçirmek isteyenler,
- Yarım kalan projesini devretmek isteyenler,
- Bize bir proje yönlendirip komisyon almak isteyenler,
- Ortaklık modeliyle çalışmak isteyenler.

Başvurular ayrı bir projede bulunan **Astra Yönetim Paneli**'nde teknik ekip tarafından bir yönetici ve mimar gözüyle değerlendirilecek. Aşağıdaki **alan anahtarları ve seçenek değerleri bir veri sözleşmesidir**. Bunları birebir kullan; yeniden adlandırma, ekleme ya da çıkarma yapma.

## Genel kurallar

- Projenin mevcut stack'ini, klasör yapısını, form kütüphanesini ve stil yaklaşımını kullan. Yeni bir UI kütüphanesi ekleme.
- Görsel dil, sitedeki mevcut **"Geliştirici Ağı başvuru formu"** ile aynı olsun:
  - Bölüm başlıkları küçük, monospace, büyük harf ve geniş harf aralıklı.
  - Masaüstünde iki sütunlu grid.
  - Çoklu seçimler hap şeklinde checkbox'lar.
  - Zorunlu alanlarda `*`.
- Metinleri projenin metin/sabit dosyası düzenine koy; JSX'e gömme. Değişken ve fonksiyon adları İngilizce olsun.
- Gereksiz yorum ekleme. Mobilde yatay kaydırma olmasın. Her input'un label'ı olsun.
- Route: **`/bir-projem-var`**. Panel bu adrese link veriyor, değiştirme.

## Sayfa metinleri

- Başlık: **Bir Projem Var**
- Açıklama: "Fikrinizi, yarım kalan projenizi ya da yönlendirmek istediğiniz bir işi anlatın. Teknik ekibimiz bir yönetici ve mimar gözüyle değerlendirip size dönüş yapsın."
- Not: "Zorunlu alanlar * ile işaretlidir."

## Form alanları

### 1. İLETİŞİM BİLGİLERİ

| key | Etiket | Tip | Zorunlu | Placeholder |
|---|---|---|---|---|
| `fullName` | Ad Soyad | text | ✓ (min 3) | Adınız ve soyadınız |
| `email` | E-posta | email | ✓ | ornek@mail.com |
| `phone` | Telefon | tel | ✓ | 05xx xxx xx xx |
| `role` | Projedeki rolünüz | text | ✓ | Örn. Kurucu, Ürün Sahibi, CTO |
| `companyName` | Şirket / girişim adı | text | | Şirket adı |
| `linkedinUrl` | LinkedIn profili | text | | linkedin.com/in/kullanici-adi |

### 2. PROJE ÖZETİ

| key | Etiket | Tip | Zorunlu | Placeholder |
|---|---|---|---|---|
| `projectName` | Proje adı | text, tam genişlik | ✓ (min 3) | Örn. Kooperatif pazar yeri |
| `productType` | Ürün tipi | select (`PRODUCT_TYPE`) | ✓ | |
| `sector` | Sektör | select (`SECTOR`) | ✓ | |
| `summary` | Projeyi kısaca anlatın | textarea (3 satır) | ✓ (min 20) | Ürünün ne yaptığını 2-3 cümleyle anlatın |
| `problem` | Hangi problemi çözüyor? | textarea (2 satır) | ✓ (min 10) | Kullanıcının bugün yaşadığı sorun |
| `targetAudience` | Hedef kullanıcılar kimler? | text, tam genişlik | ✓ (min 5) | Örn. Türkiye'deki 50-500 çalışanlı lojistik firmaları |

### 3. MEVCUT DURUM

| key | Etiket | Tip | Zorunlu | Not |
|---|---|---|---|---|
| `stage` | Projenin şu anki aşaması | select (`SUBMISSION_STAGE`) | ✓ | |
| `completionPercent` | Tahmini tamamlanma oranı (%) | sayı (0–100), varsayılan `0` | | Yardım metni: "Geliştirme sürüyorsa veya yarım kaldıysa doldurun." |
| `existingAssets` | Elinizde neler var? | çoklu checkbox (`EXISTING_ASSET`), tam genişlik | | |
| `techStack` | Kullanılan teknolojiler | text | | Örn. Laravel, Vue, MySQL, AWS |
| `repositoryUrl` | Kod deposu (varsa) | text | | https://github.com/... |
| `stallReason` | Proje neden yarım kaldı / neden ekip değişikliği gerekiyor? | textarea (2 satır) | | Örn. Ajansla anlaşma bitti, kod kalitesi düşük, ekip dağıldı |

**Koşullu gösterim:** `techStack`, `repositoryUrl` ve `stallReason` alanlarını yalnızca `stage` değeri `in_development`, `stalled` ya da `live` olduğunda göster. Gizliyken değerleri boş string olarak gönderilir.

### 4. KAPSAM VE TEKNİK İHTİYAÇLAR

| key | Etiket | Tip | Zorunlu | Placeholder |
|---|---|---|---|---|
| `platforms` | Hangi platformlarda çalışacak? | çoklu checkbox (`PLATFORM`), tam genişlik | ✓ (en az 1) | |
| `coreFeatures` | Olmazsa olmaz özellikler (MVP) | textarea (4 satır) | ✓ (min 10) | Her satıra bir özellik yazın |
| `integrations` | Gerekli entegrasyonlar | çoklu checkbox (`INTEGRATION`), tam genişlik | | |
| `expectedUsers` | Beklenen kullanıcı hacmi | select (`EXPECTED_USERS`) | ✓ | |
| `technicalRequirements` | Güvenlik, KVKK, performans veya altyapı beklentileri | textarea (2 satır) | | Örn. 2FA, rol bazlı yetki, verilerin Türkiye'de tutulması |

### 5. BÜTÇE VE TAKVİM

| key | Etiket | Tip | Zorunlu |
|---|---|---|---|
| `budgetRange` | Bütçe aralığı | select (`PROJECT_BUDGET`) | ✓ |
| `timeline` | Hedef takvim | select (`DELIVERY_TIMELINE`) | ✓ |
| `fundingStatus` | Finansman durumu | select (`FUNDING_STATUS`) | ✓ |

### 6. İŞ BİRLİĞİ MODELİ

`collaborationModel` (zorunlu) alanı "Nasıl çalışmak istersiniz?" etiketiyle gösterilir. Masaüstünde 2×2 seçilebilir **kart** olarak tasarla (radio davranışı). Seçili kart vurgulu kenarlıklı olsun. Her kartta başlık ve açıklama var:

| value | Başlık | Açıklama |
|---|---|---|
| `continue_existing` | Yarım kalan projemi devralın | Mevcut kod ve dokümanları inceleyip projeyi kaldığı yerden tamamlarız. |
| `build_from_scratch` | Sıfırdan geliştirin | Analiz, tasarım ve geliştirmeyi uçtan uca biz yürütürüz. |
| `referral` | Referans oluyorum (komisyon) | Projeyi bize yönlendirirsiniz; süreçte yer almadan proje bedeli üzerinden komisyon alırsınız. |
| `partnership` | Ortaklık / gelir paylaşımı | Geliştirme maliyetinin bir kısmını gelir paylaşımı veya hisse ile karşılarız. |

**`referral` seçilirse** kartların altında bir altın vurgulu bilgi kutusu ve dört alan açılır:
- Bilgi kutusu: "Proje sözleşmeye bağlanırsa proje bedeli üzerinden %10 komisyon alırsınız." Oran (`0.1`) tek bir sabitten gelsin.
- Alanlar:
  - `referralCompany`: Yönlendirdiğiniz firma (zorunlu)
  - `referralContact`: Firma yetkilisi (zorunlu)
  - `referralEmail`: Yetkili e-posta (zorunlu, email)
  - `referralRelationship`: Firma ile ilişkiniz (isteğe bağlı; placeholder: Örn. Danışmanıyım, eski çalışanıyım)
- Bu alanlar boşsa hata metni: "Referans olduğunuz firma ve yetkili bilgilerini girin."

### 7. SÖZLEŞME VE ONAYLAR

- `kvkkConsent` (boolean, zorunlu): "KVKK aydınlatma metnini okudum, kişisel verilerimin işlenmesine onay veriyorum." Hata metni: "KVKK onayı zorunludur."
- `ndaRequested` (boolean, isteğe bağlı): "Karşılıklı gizlilik sözleşmesi (NDA) imzalamak istiyorum"
- Kesik çizgili çerçeve içinde bir sözleşme kutusu:
  - Başlık: **Proje Başvurusu ve İş Birliği Çerçeve Sözleşmesi**. Sağda "Sözleşme özetini oku" linki modal açar.
  - `agreementAccepted` (boolean, zorunlu): "Proje Başvurusu ve İş Birliği Çerçeve Sözleşmesi'ni okudum, onaylıyorum." Hata metni: "Devam etmek için sözleşmeyi onaylamanız gerekir."
  - `signatureName` (text, zorunlu): Etiket "Dijital imza", placeholder "Adınızı ve soyadınızı yazın". Yardım metni: "Ad soyadınızı yazmanız, sözleşmeyi elektronik ortamda imzaladığınız anlamına gelir."

**Sözleşme modalı** (sürüm: `PIS-2026.1`). Maddeleri numaralı liste olarak göster:
1. Paylaştığınız proje bilgileri yalnızca değerlendirme amacıyla kullanılır ve gizli tutulur.
2. Başvuru, Astra için proje üstlenme yükümlülüğü doğurmaz; değerlendirme sonrası yazılı teklif sunulur.
3. Yarım kalan projelerde kaynak kod ve dokümanların size ait olduğunu ve devretmeye yetkili olduğunuzu beyan edersiniz.
4. Referans modelinde, yönlendirdiğiniz proje sözleşmeye bağlanırsa proje bedelinin %10 oranında komisyon ödenir; sürece dahil olmanız gerekmez. (Oran aynı sabitten gelsin.)
5. Ortaklık / gelir paylaşımı modelinde koşullar ayrı bir sözleşme ile belirlenir.
6. Talep etmeniz halinde karşılıklı gizlilik sözleşmesi (NDA) ayrıca imzalanır.

Modalın altına uyarı kutusu ekle: "Bu metin bir özet taslağıdır; nihai sözleşme hukuk incelemesinden sonra yayımlanacaktır."

## Seçenekler (value → etiket)

Gönderilen değer **value**'dur; etiket yalnızca ekranda gösterilir.

**SECTOR**: `ecommerce` E-ticaret · `retail` Perakende · `fintech` Finans / Fintech · `saas` SaaS / Yazılım · `health` Sağlık · `education` Eğitim · `logistics` Lojistik · `tourism` Turizm · `manufacturing` Üretim / Sanayi · `agriculture` Tarım / Gıda · `media` Medya / Eğlence · `real_estate` Gayrimenkul / İnşaat · `energy` Enerji · `other` Diğer

**PRODUCT_TYPE**: `web` Web uygulaması · `mobile` Mobil uygulama · `ecommerce` E-ticaret · `saas` SaaS ürün · `internal_tool` Kurum içi yazılım · `ai` Yapay zeka çözümü · `other` Diğer

**SUBMISSION_STAGE**: `idea` Fikir aşamasında · `designed` Tasarımı / analizi hazır · `in_development` Geliştirme sürüyor · `stalled` Yarım kaldı · `live` Canlıda, geliştirilmesi gerekiyor

**EXISTING_ASSET**: `requirements` Gereksinim / analiz dokümanı · `design` UI tasarımları (Figma vb.) · `source_code` Kaynak kod · `live_environment` Canlı ortam · `test_environment` Test ortamı · `documentation` Teknik dokümantasyon

**PLATFORM**: `web` Web · `ios` iOS · `android` Android · `admin_panel` Yönetim paneli · `desktop` Masaüstü

**INTEGRATION**: `payment` Ödeme (iyzico, PayTR…) · `erp` ERP / muhasebe (Logo, Mikro…) · `marketplace` Pazaryeri · `cargo` Kargo · `sms_email` SMS / e-posta · `maps` Harita / konum · `ai` Yapay zeka servisleri · `sso` Kurumsal giriş (SSO)

**EXPECTED_USERS**: `under_1k` Aylık 1.000 kullanıcıdan az · `1k_10k` Aylık 1.000 – 10.000 · `10k_100k` Aylık 10.000 – 100.000 · `100k_plus` Aylık 100.000 +

**PROJECT_BUDGET**: `under_100k` 100.000 ₺ altı · `100k_250k` 100.000 – 250.000 ₺ · `250k_500k` 250.000 – 500.000 ₺ · `500k_1m` 500.000 – 1.000.000 ₺ · `1m_plus` 1.000.000 ₺ + · `undecided` Henüz belirlenmedi

**DELIVERY_TIMELINE**: `asap` En kısa sürede · `1_3_months` 1-3 ay · `3_6_months` 3-6 ay · `6_plus_months` 6 ay + · `flexible` Esnek

**FUNDING_STATUS**: `self_funded` Öz kaynak · `seeking` Yatırım arıyorum · `funded` Yatırım aldı · `grant` Hibe / destek (KOSGEB, TÜBİTAK…)

Select'lerin varsayılan değeri boş olsun; placeholder "Seçiniz" görünsün.

## Doğrulama

- Genel hata metinleri: "Bu alan zorunludur.", "Geçerli bir e-posta adresi girin.", "En az {n} karakter olmalıdır.", "En az bir seçim yapın."
- **Telefon:** `/^0?5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$|^0?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}$/`. Hata: "Geçerli bir telefon numarası girin (05xx xxx xx xx)."
- `completionPercent`: 0 ile 100 arasında sayı.
- **İmza:** `signatureName` ile `fullName` karşılaştırılırken iki taraf da şöyle normalize edilir: `trim()`, ardışık boşlukları teke indir, `toLocaleLowerCase('tr-TR')`. Eşleşmezse şu hata gösterilir: "İmza alanına adınızı ve soyadınızı başvurudakiyle aynı şekilde yazın."
- Referans alanları yalnızca `collaborationModel === 'referral'` iken zorunludur.

## Gönderilen veri (payload)

Form alanları şöyle dönüştürülür:
- `agreementAccepted` ve `signatureName` → `agreement` nesnesi.
- `referral*` alanları → `referral` nesnesi. Bu nesne yalnızca model `referral` ise gönderilir, aksi halde alan hiç eklenmez.
- `code` (örn. `PB-1001`) backend tarafında üretilir; formdan gönderilmez.

```json
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "companyName": "string",
  "role": "string",
  "linkedinUrl": "string",
  "projectName": "string",
  "productType": "PRODUCT_TYPE",
  "sector": "SECTOR",
  "summary": "string",
  "problem": "string",
  "targetAudience": "string",
  "stage": "SUBMISSION_STAGE",
  "existingAssets": ["EXISTING_ASSET"],
  "completionPercent": 0,
  "techStack": "string",
  "repositoryUrl": "string",
  "stallReason": "string",
  "platforms": ["PLATFORM"],
  "coreFeatures": "string (satırlar \\n ile ayrılır)",
  "integrations": ["INTEGRATION"],
  "expectedUsers": "EXPECTED_USERS",
  "technicalRequirements": "string",
  "budgetRange": "PROJECT_BUDGET",
  "timeline": "DELIVERY_TIMELINE",
  "fundingStatus": "FUNDING_STATUS",
  "collaborationModel": "continue_existing | build_from_scratch | referral | partnership",
  "referral": {
    "companyName": "string",
    "contactName": "string",
    "contactEmail": "string",
    "relationship": "string"
  },
  "kvkkConsent": true,
  "ndaRequested": false,
  "agreement": { "version": "PIS-2026.1", "signerName": "<signatureName>", "signedAt": "<ISO tarih>" },
  "status": "received",
  "reviewerNote": "",
  "createdAt": "<ISO tarih>"
}
```

- Gönderimi tek bir servis fonksiyonunda izole et: `submitProjectApplication(payload)`. Fonksiyon backend'in döndürdüğü kaydı (varsa `code` ile birlikte) geri döndürsün.
- Backend henüz hazır değil. Şimdilik bu fonksiyon gecikmeli bir mock olsun, başarılı dönsün ve geliştirme ortamında payload'ı konsola yazsın.
- İleride bu fonksiyon Supabase'deki `project_submissions` tablosuna insert yapacak; `code` veritabanında sıra numarasıyla üretilecek. Kolon eşlemesi o zaman netleşecek; form ve bileşenler bundan etkilenmemeli.
- Projede Supabase istemcisi yoksa ekleme.

## Gönderim sonrası

- Gönderim sırasında buton pasif olsun ve "Gönderiliyor..." yazsın. Normal metni "Başvuruyu gönder".
- Başarılı olunca formun yerine onay ekranı gelsin:
  - Yeşil onay ikonu.
  - Başlık: "Başvurunuz alındı"
  - Metin: "İlgili ekibimiz başvurunuzu değerlendirdikten sonra e-posta ile size dönüş yapacak."
  - Backend bir `code` döndürdüyse hap şeklinde göster: "Başvuru numaranız: PB-1001".
- Hata olursa formu koru ve sitenin mevcut toast/uyarı yapısıyla hata göster.

## Kapsam dışı

- Değerlendirme, projeye dönüştürme ve yatırım fırsatı oluşturma bu projede yapılmaz; hepsi yönetim panelinde.
- Dosya yükleme (brief, ekran görüntüsü) şimdilik yok. Eklenirse önce veri sözleşmesi güncellenir.
