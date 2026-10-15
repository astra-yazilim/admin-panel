# Prompt: Melek Yatırımcı Başvuru Sayfası

Astra Yazılım Çözümleri landing sitesine **melek yatırımcı başvuru sayfası** ekle. Bu formdan gelen başvurular ayrı bir projede bulunan **Astra Yönetim Paneli** tarafından okunup değerlendirilecek. Bu yüzden aşağıdaki **alan anahtarları ve seçenek değerleri bir veri sözleşmesidir**. Bunları birebir kullan; yeniden adlandırma, ekleme ya da çıkarma yapma.

## Genel kurallar

- Projenin mevcut stack'ini, klasör yapısını, form kütüphanesini ve stil yaklaşımını kullan. Yeni bir UI kütüphanesi ekleme.
- Görsel dil, sitedeki mevcut **"Geliştirici Ağı başvuru formu"** ile aynı olsun:
  - Bölüm başlıkları küçük, monospace, büyük harf ve geniş harf aralıklı ("KİŞİSEL BİLGİLER" gibi).
  - Masaüstünde iki sütunlu alan grid'i.
  - Çoklu seçimler hap şeklinde checkbox'lar.
  - Zorunlu alanlarda `*`.
  - Dosya alanları aynı stilde.
- Metinleri projenin metin/sabit dosyası düzenine koy; JSX'e gömme. Değişken ve fonksiyon adları İngilizce olsun.
- Gereksiz yorum ekleme. Mobilde yatay kaydırma olmasın. Her input'un label'ı olsun.
- Route: **`/melek-yatirimci-basvurusu`**. Panel bu adrese link veriyor, değiştirme.

## Sayfa metinleri

- Başlık: **Melek Yatırımcı Başvurusu**
- Açıklama: "Astra ekosisteminde geliştirilen ürün ve projelere yatırım yapmak için başvurun. Onay sonrası yalnızca size açılan proje özetlerini görüntüleyebileceğiniz bir hesap tanımlanır."
- Not: "Zorunlu alanlar * ile işaretlidir."

## Form alanları

### 1. KİŞİSEL BİLGİLER

| key | Etiket | Tip | Zorunlu | Placeholder / not |
|---|---|---|---|---|
| `fullName` | Ad Soyad | text | ✓ (min 3) | Adınız ve soyadınız |
| `corporateEmail` | Kurumsal e-posta | email | ✓ | ad.soyad@sirketiniz.com · Yardım metni: "Doğrulama kurumsal e-posta adresinizle yapılır." |
| `phone` | Telefon | tel | ✓ | 05xx xxx xx xx |
| `city` | Şehir | text | | İstanbul |
| `title` | Ünvan | text | ✓ | Örn. Genel Müdür, CFO |
| `profession` | Meslek | text | ✓ | Örn. Finansçı, Mühendis, Avukat |
| `linkedinUrl` | LinkedIn profili | text | ✓ | linkedin.com/in/kullanici-adi (tam genişlik) |

### 2. ŞİRKET BİLGİLERİ

| key | Etiket | Tip | Zorunlu |
|---|---|---|---|
| `companyName` | Çalıştığınız / bağlı olduğunuz şirket | text | ✓ |
| `companyWebsite` | Şirket web sitesi | text (placeholder: sirket.com) | |
| `sector` | Sektör | select (`SECTOR`) | ✓ |
| `employeeCount` | Çalışan sayısı | select (`EMPLOYEE_COUNT`) | ✓ |

### 3. YATIRIMCI PROFİLİ

| key | Etiket | Tip | Zorunlu |
|---|---|---|---|
| `investorType` | Yatırımcı tipi | select (`INVESTOR_TYPE`) | ✓ |
| `budgetRange` | Yatırım bütçesi aralığı | select (`INVESTMENT_BUDGET`) | ✓ |
| `horizon` | Yatırım vadesi | select (`INVESTMENT_HORIZON`) | ✓ |
| `previousInvestments` | Önceki yatırım deneyimi | select (`PREVIOUS_INVESTMENTS`) | ✓ |
| `involvement` | Sürece katılım şekli | select (`INVOLVEMENT`) | ✓ |
| `referralSource` | Bizi nereden duydunuz? | text (placeholder: Örn. LinkedIn, tavsiye, etkinlik) | |
| `preferredStages` | İlgilendiğiniz aşamalar | çoklu checkbox (`INVESTMENT_STAGE`), tam genişlik | ✓ (en az 1) |
| `interestAreas` | İlgilendiğiniz sektörler | çoklu checkbox (`SECTOR`), tam genişlik | ✓ (en az 1) |
| `hasInvestorLicense` | Bireysel Katılım Yatırımcısı (BKY) lisansım var | tek checkbox (boolean) | |
| `note` | Eklemek istedikleriniz | textarea (3 satır; placeholder: Yatırım tezi, özellikle ilgilendiğiniz alanlar...) | |

### 4. SÖZLEŞME VE ONAYLAR

- `kvkkConsent` (boolean, zorunlu): "KVKK aydınlatma metnini okudum, kişisel verilerimin işlenmesine onay veriyorum." Hata metni: "KVKK onayı zorunludur."
- Kesik çizgili çerçeve içinde bir sözleşme kutusu:
  - Başlık: **Yatırımcı Gizlilik ve Çerçeve Sözleşmesi**. Sağda "Sözleşme özetini oku" linki, aşağıdaki maddeleri bir modal'da açar.
  - `agreementAccepted` (boolean, zorunlu): "Yatırımcı Gizlilik ve Çerçeve Sözleşmesi'ni okudum, onaylıyorum." Hata metni: "Devam etmek için sözleşmeyi onaylamanız gerekir."
  - `signatureName` (text, zorunlu): Etiket "Dijital imza", placeholder "Adınızı ve soyadınızı yazın". Yardım metni: "Ad soyadınızı yazmanız, sözleşmeyi elektronik ortamda imzaladığınız anlamına gelir."

**Sözleşme modalı** (sürüm: `YGS-2026.1`). Maddeleri numaralı liste olarak göster:
1. Platformda görüntülenen tüm proje özetleri, finansal veriler ve belgeler gizli bilgidir; üçüncü kişilerle paylaşılamaz, kopyalanamaz.
2. Gizlilik yükümlülüğü, yatırım yapılsın ya da yapılmasın görüntülenen tüm projeler için geçerlidir ve erişim sona erdikten sonra 3 yıl sürer.
3. Platform erişimi kişiseldir; giriş bilgileri başkasına devredilemez.
4. Fırsatlarda yer alan bilgiler yatırım tavsiyesi değildir; yatırım kararı ve sorumluluğu yatırımcıya aittir.
5. Yatırım süreci, taraflar arasında ayrıca imzalanacak yatırım sözleşmesi ile yürütülür.
6. Sözleşmeye aykırılık halinde Astra erişimi derhal sonlandırma ve doğan zararları talep etme hakkını saklı tutar.

Modalın altına uyarı kutusu ekle: "Bu metin bir özet taslağıdır; nihai sözleşme hukuk incelemesinden sonra yayımlanacaktır."

## Seçenekler (value → etiket)

Gönderilen değer **value**'dur; etiket yalnızca ekranda gösterilir.

**SECTOR**: `ecommerce` E-ticaret · `retail` Perakende · `fintech` Finans / Fintech · `saas` SaaS / Yazılım · `health` Sağlık · `education` Eğitim · `logistics` Lojistik · `tourism` Turizm · `manufacturing` Üretim / Sanayi · `agriculture` Tarım / Gıda · `media` Medya / Eğlence · `real_estate` Gayrimenkul / İnşaat · `energy` Enerji · `other` Diğer

**EMPLOYEE_COUNT**: `1_10` 1-10 · `11_50` 11-50 · `51_200` 51-200 · `201_1000` 201-1.000 · `1000_plus` 1.000+

**INVESTOR_TYPE**: `individual` Bireysel melek yatırımcı · `corporate` Kurumsal (şirket adına) · `angel_network` Melek yatırım ağı üyesi · `family_office` Aile ofisi · `fund` Girişim sermayesi fonu

**INVESTMENT_BUDGET**: `250k_1m` 250.000 – 1.000.000 ₺ · `1m_5m` 1.000.000 – 5.000.000 ₺ · `5m_20m` 5.000.000 – 20.000.000 ₺ · `20m_plus` 20.000.000 ₺ +

**INVESTMENT_HORIZON**: `under_1y` 1 yıldan kısa · `1_3y` 1-3 yıl · `3_5y` 3-5 yıl · `5y_plus` 5 yıl +

**INVESTMENT_STAGE**: `idea` Fikir · `mvp` MVP / Prototip · `early_revenue` İlk gelir · `growth` Büyüme

**PREVIOUS_INVESTMENTS**: `none` Henüz yok · `1_3` 1-3 yatırım · `4_10` 4-10 yatırım · `10_plus` 10+ yatırım

**INVOLVEMENT**: `passive` Pasif (yalnızca finansman) · `mentor` Mentorluk / danışmanlık · `active` Aktif (yönetim kurulu / operasyon)

Select'lerin varsayılan değeri boş olsun; placeholder "Seçiniz" görünsün.

## Doğrulama

- Genel hata metinleri: "Bu alan zorunludur.", "Geçerli bir e-posta adresi girin.", "En az {n} karakter olmalıdır.", "En az bir seçim yapın."
- **Kurumsal e-posta:** Aşağıdaki alan adlarıyla biten adresleri reddet. Hata: "Lütfen kurumsal e-posta adresinizi kullanın (gmail, hotmail vb. kabul edilmez)."
  `gmail.com, googlemail.com, hotmail.com, hotmail.com.tr, outlook.com, live.com, yahoo.com, yandex.com, yandex.com.tr, icloud.com, mail.com, protonmail.com`
- **Telefon:** `/^0?5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$|^0?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}$/`. Hata: "Geçerli bir telefon numarası girin (05xx xxx xx xx)."
- **İmza:** `signatureName` ile `fullName` karşılaştırılırken iki taraf da şöyle normalize edilir: `trim()`, ardışık boşlukları teke indir, `toLocaleLowerCase('tr-TR')`. Eşleşmezse `signatureName` alanında şu hata gösterilir: "İmza alanına adınızı ve soyadınızı başvurudakiyle aynı şekilde yazın."
- Doğrulama hem gönderimde hem alan terk edildiğinde çalışsın. Hatalar alanın altında görünsün.

## Gönderilen veri (payload)

`agreementAccepted` ve `signatureName` ayrı alan olarak gönderilmez. Bunlar `agreement` nesnesine dönüşür. Yönetim alanları (`status`, `reviewerNote`) sabit başlangıç değerleriyle gönderilir.

```json
{
  "fullName": "string",
  "corporateEmail": "string",
  "phone": "string",
  "city": "string",
  "title": "string",
  "profession": "string",
  "linkedinUrl": "string",
  "companyName": "string",
  "companyWebsite": "string",
  "sector": "SECTOR",
  "employeeCount": "EMPLOYEE_COUNT",
  "investorType": "INVESTOR_TYPE",
  "budgetRange": "INVESTMENT_BUDGET",
  "horizon": "INVESTMENT_HORIZON",
  "preferredStages": ["INVESTMENT_STAGE"],
  "interestAreas": ["SECTOR"],
  "previousInvestments": "PREVIOUS_INVESTMENTS",
  "involvement": "INVOLVEMENT",
  "hasInvestorLicense": false,
  "referralSource": "string",
  "note": "string",
  "kvkkConsent": true,
  "agreement": { "version": "YGS-2026.1", "signerName": "<signatureName>", "signedAt": "<ISO tarih>" },
  "status": "received",
  "reviewerNote": "",
  "createdAt": "<ISO tarih>"
}
```

- Gönderimi tek bir servis fonksiyonunda izole et: `submitInvestorApplication(payload)`.
- Backend henüz hazır değil. Şimdilik bu fonksiyon gecikmeli bir mock olsun ve başarılı dönsün. Payload'ı geliştirme ortamında konsola yazsın.
- İleride bu fonksiyon Supabase'deki `investors` tablosuna insert yapacak. Kolon eşlemesi o zaman netleşecek; form ve bileşenler bundan etkilenmemeli.
- Projede Supabase istemcisi yoksa ekleme.

## Gönderim sonrası

- Gönderim sırasında buton pasif olsun ve "Gönderiliyor..." yazsın. Normal metni "Başvuruyu gönder".
- Başarılı olunca formun yerine onay ekranı gelsin:
  - Yeşil onay ikonu.
  - Başlık: "Başvurunuz alındı"
  - Metin: "İlgili ekibimiz başvurunuzu değerlendirdikten sonra e-posta ile size dönüş yapacak."
- Hata olursa formu koru ve sitenin mevcut toast/uyarı yapısıyla hata göster.

## Kapsam dışı

- Panel girişi, yatırımcı portalı ve onay süreci bu projede yapılmaz; hepsi yönetim panelinde.
- Ek alan, dosya yükleme ya da CAPTCHA ekleme. Gerekirse önce veri sözleşmesi güncellenir.
