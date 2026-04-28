# VCF Katkı Kuralları

VibeCoding Framework (VCF) bir prompt kütüphanesi değildir. Yapay zeka destekli yazılım geliştirme için yapılandırılmış, katı kuralları olan bir metodolojidir. 

Buraya katkıda bulunurken üç temel direği asla bozma:
1. **Prompt Sözleşmeleri (Prompt Contracts)**
2. **Oturum İş Akışları (Session Workflows)**
3. **Bağlam Hijyeni (Context Hygiene)**

## Kurallar

- **Metodoloji Önce Gelir:** Araçlar ve promptlar, metodolojinin birer çıktısıdır. Tersi değil.
- **Kısa ve Net Ol:** Laf salatası yapma. Doğrudan konuya gir.
- **Soyutlamalardan Kaçın:** Kavramlar yerine kodu ve dosya yollarını göster.
- **Şablonları Koru:** `prompts/` altındaki her dosya kesin bir YAML frontmatter yapısına sahip olmak zorundadır.
- **Bağlamı Koru:** Her oturum başında "Proje Özeti", "Aktif İş Akışı", "Açık Kararlar" ve "Kapsam Dışı" bilgileri verilmelidir. Her oturum sonunda özet çıkarılmalıdır.

## Kod Standartları

- VCF araçlarını geliştirirken Node.js (veya tarayıcı tabanlı GUI) kullan.
- Dış bağımlılıkları minimumda tut. 
- Arayüzlerde Vanilla CSS ve React ile modern, premium bir tasarım dili kullan.

Bu kuralları esnetme.
