# VCF Metodolojisi

VCF, AI destekli kodlamayı kaostan kurtaran bir sistemdir. Bu dizin VCF metodolojisinin kavramlarını ve sözlüğünü barındırır.

## Temel Kavramlar

VCF üç ayağa oturur:

1. **Prompt Sözleşmeleri:** LLM'e ne yapması gerektiğini söylemezsin. LLM ile bir sözleşme yaparsın. Girdi formatını ve beklenen çıktı formatını kesin çizgilerle belirlersin. (Bkz: `prompts/`)
2. **Oturum İş Akışları:** Kodlama süreci rastgele sorularla yürümez. Belirli adımlardan oluşan iş akışlarıyla ilerler. (Bkz: `workflows/`)
3. **Bağlam Hijyeni:** LLM'in kafası çabuk karışır. Her oturum başında ona dünyayı (projeyi), nerede olduğunu (aktif adım) ve neye dokunmaması gerektiğini hatırlatırsın.

## Prensipler

- **Şansa Yer Yok:** LLM'den "bir şeyler uydurmasını" isteme. Kuralları sen koyarsın.
- **Tek İş, Tek Adım:** Bir prompt ile mimari çizip aynı prompt ile test yazdırma. 
- **Sınırları Çiz:** LLM'e ne yapacağını söylemek kadar, ne *yapmayacağını* söylemek de önemlidir.
