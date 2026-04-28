# Oturum İş Akışları (Session Workflows)

Bu dizin, adım adım ilerleyen oturum rehberlerini içerir (feature-branch, hotfix, refactor vb.).
Bir geliştirici bir görevi başından sonuna kadar nasıl götüreceğini bu dosyalara bakarak anlar.

## Dosya Formatı

Her iş akışı dosyası aşağıdaki yapıyı takip etmelidir:

```markdown
# Workflow: [name]

**Intent:** Tek cümlelik amaç.
**Trigger:** Geliştirici bu iş akışını ne zaman kullanmalı?
**Estimated session length:** X–Y prompt

## Adımlar

### 1. [Adım Adı]
- Kullanılacak prompt: `prompts/[name].md`
- Gerekli girdi (Input): …
- Beklenen çıktı: …
- Çıkış koşulu: …

### 2. …

## Bağlam Hijyeni Notları
Adımlar arasında hangi bağlamın (context) aktarılması gerektiği.
```

## Kurallar
- Bir iş akışı belirli bir problemi baştan sona çözmelidir.
- Her adımın bir "Çıkış koşulu" (Exit condition) olmalıdır. Çıktı doğrulanmadan diğer adıma geçilemez.
