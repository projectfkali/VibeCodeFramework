const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

/**
 * VCF Workflow Runner (Gerçek LLM Entegrasyonu)
 */
async function executeRealSession(apiKey, workflowName, featureRequest) {
    console.log(`[VCF-RUNNER] İş akışı başlatılıyor: ${workflowName}`);
    
    try {
        // API Key ile Gemini Client oluştur
        const ai = new GoogleGenAI({ apiKey: apiKey });

        // Şimdilik sadece Adım 1 (architect) için prompt okuyoruz
        const promptPath = path.join(__dirname, '../../prompts/architect.md');
        if (!fs.existsSync(promptPath)) {
            throw new Error("Prompt şablonu (architect.md) bulunamadı.");
        }
        
        let promptContent = fs.readFileSync(promptPath, 'utf-8');
        
        // Değişkenleri yerleştir (Context Injection)
        const currentArchitecture = "VCF Framework: Node.js (Express) backend ve React (Vite) frontend. İletişim REST API üzerinden sağlanıyor.";
        promptContent = promptContent.replace(/{{feature_request}}/g, featureRequest || 'Yeni bir modül');
        promptContent = promptContent.replace(/{{current_architecture}}/g, currentArchitecture);

        console.log(`[VCF-RUNNER] Gemini API'sine istek gönderiliyor...`);
        
        // Gemini API Çağrısı (gemini-2.5-flash hızlı ve yeteneklidir)
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptContent,
        });

        console.log(`[VCF-RUNNER] Yanıt başarıyla alındı.`);

        return {
            status: 'success',
            workflow: workflowName,
            output: response.text
        };

    } catch (error) {
        console.error(`[VCF-RUNNER] Hata:`, error.message);
        return {
            status: 'error',
            message: error.message
        };
    }
}

/**
 * VCF Coder (Uygulayıcı) Entegrasyonu
 */
async function executeCoderSession(apiKey, approvedPlan, targetFile) {
    console.log(`[VCF-RUNNER] Coder oturumu başlatılıyor, Hedef: ${targetFile}`);
    
    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });

        const promptPath = path.join(__dirname, '../../prompts/coder.md');
        if (!fs.existsSync(promptPath)) {
            throw new Error("Prompt şablonu (coder.md) bulunamadı.");
        }
        
        let promptContent = fs.readFileSync(promptPath, 'utf-8');
        
        promptContent = promptContent.replace(/{{approved_plan}}/g, approvedPlan);
        promptContent = promptContent.replace(/{{target_file}}/g, targetFile);

        console.log(`[VCF-RUNNER] Gemini API'sine Coder isteği gönderiliyor...`);
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptContent,
        });

        console.log(`[VCF-RUNNER] Coder yanıtı başarıyla alındı.`);

        return {
            status: 'success',
            output: response.text
        };

    } catch (error) {
        console.error(`[VCF-RUNNER] Coder Hatası:`, error.message);
        return {
            status: 'error',
            message: error.message
        };
    }
}

module.exports = {
    executeRealSession,
    executeCoderSession
};
