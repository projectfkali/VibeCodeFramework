# Prompt Sözleşmeleri (Prompt Contracts)

Bu dizin, VCF oturumlarında kullanılan tekrar kullanılabilir prompt şablonlarını barındırır.
Bunlar sıradan promptlar değildir. LLM ile yapılan bağlayıcı sözleşmelerdir.

## Dosya Formatı

`prompts/` altındaki her dosya YAML frontmatter ve Markdown gövdesinden oluşmalıdır.

Örnek Şablon:
```markdown
---
name: [prompt-name]
version: 1.0.0
intent: >
  Tek cümle: LLM'in bu prompt ile ne yapması gerektiği.
inputs:
  - name: [input_name]
    description: [ne olduğu]
    required: true
output_contract: >
  Geçerli bir yanıtın nasıl görünmesi gerektiğini açıkla.
  LLM X formatında Y üretmelidir.
tags: [arch, review, debug, refactor, test, docs]
---
[Prompt gövdesi Markdown formatında — LLM'e doğrudan talimatlar]
```

## Kurallar
- Zayıf ve yoruma açık ifadeler kullanma ("Lütfen şunu yazar mısın" yerine "Aşağıdaki koda X ekle" de).
- Girdi (inputs) ve çıktı (output_contract) sınırlarını kesin olarak belirle.
