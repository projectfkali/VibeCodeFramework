# Workflow: Feature Branch

**Intent:** Mevcut bir projeye yeni bir özellik (feature) eklerken baştan sona uygulanacak standart prosedür.
**Trigger:** Geliştirici yepyeni bir özellik eklemeye veya büyük bir modül yaratmaya karar verdiğinde.
**Estimated session length:** 3–5 prompt

## Adımlar

### 1. Planlama ve Tasarım
- Prompt to use: `prompts/architect.md`
- Input required: Özellik talebi (feature_request) ve mevcut sistem durumu (current_architecture).
- Expected output: Mimari plan dokümanı (Değişecek dosyalar, test planı).
- Exit condition: Geliştiricinin plana açıkça "Onaylandı" yanıtı vermesi.

### 2. Uygulama (Uygulanacak her dosya için tekrarlanır)
- Prompt to use: `prompts/coder.md`
- Input required: Onaylı plan (approved_plan) ve hedef dosya yolu (target_file).
- Expected output: Hedef dosya için eksiksiz kod.
- Exit condition: Kodun başarıyla derlenmesi/çalıştırılması ve linter hatalarının olmaması.

### 3. Doğrulama ve Commit
- Prompt to use: `prompts/review.md` (Örnek)
- Input required: Yapılan değişikliklerin diff çıktısı.
- Expected output: Kod kalitesi kontrolü ve commit mesajı önerisi.
- Exit condition: Testlerin başarıyla geçmesi ve değişikliğin git'e commityenmesi.

## Bağlam Hijyeni Notları
- Adım 1'den Adım 2'ye geçerken, "Açık Kararlar" (Open Decisions) listesi sıfırlanmış ve plan tamamen netleşmiş olmalıdır.
- Adım 2 boyunca her `coder` isteğine mutlaka "Onaylanan Plan" dahil edilmelidir, LLM'in plandan sapmasına izin verilemez.
