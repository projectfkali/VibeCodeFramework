import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [promptContent, setPromptContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Promptu Panoya Kopyala');
  
  // Architect (Adım 1) State'leri
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [featureRequest, setFeatureRequest] = useState('');
  const [llmOutput, setLlmOutput] = useState(''); // Bu aynı zamanda "Onaylanmış Plan" (approvedPlan)
  const [isRunning, setIsRunning] = useState(false);

  // Coder (Adım 2) State'leri
  const [targetFile, setTargetFile] = useState('');
  const [coderOutput, setCoderOutput] = useState('');
  const [isCoding, setIsCoding] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('vcf_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const saveApiKey = () => {
    localStorage.setItem('vcf_api_key', apiKey);
    setShowSettings(false);
  };

  const fetchPrompt = async (promptName) => {
    setIsLoading(true);
    setPromptContent('');
    try {
      const response = await fetch(`http://localhost:3000/api/prompts/${promptName}`);
      if (response.ok) {
        const data = await response.json();
        setPromptContent(data.content);
      } else {
        setPromptContent('Sunucuya bağlanılamadı.');
      }
    } catch (error) {
      setPromptContent('Bağlantı hatası: Sunucu kapalı olabilir.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (activeWorkflow === 'Feature Branch') {
      fetchPrompt('architect');
      setLlmOutput('');
      setFeatureRequest('');
      setCoderOutput('');
      setTargetFile('');
    } else {
      setPromptContent('');
    }
  }, [activeWorkflow]);

  const copyToClipboard = (text, statusSetter) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      statusSetter('✅ Kopyalandı!');
      setTimeout(() => statusSetter('Panoya Kopyala'), 2000);
    });
  };

  // Adım 1: Plan Üret (Architect)
  const startAutomation = async () => {
    if (!apiKey) {
      alert("Lütfen önce Ayarlar (⚙️) kısmından Gemini API Anahtarınızı girin.");
      setShowSettings(true);
      return;
    }
    if (!featureRequest.trim()) {
      alert("Lütfen Feature Request alanını doldurun.");
      return;
    }

    setIsRunning(true);
    setLlmOutput('Gemini (Baş Mimar) planı hazırlıyor, lütfen bekleyin...\n\n');
    setCoderOutput('');

    try {
      const response = await fetch('http://localhost:3000/api/run-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowName: activeWorkflow,
          featureRequest: featureRequest,
          apiKey: apiKey
        })
      });

      const data = await response.json();
      if (response.ok && data.data.status === 'success') {
        setLlmOutput(data.data.output);
      } else {
        setLlmOutput(`Hata oluştu:\n${data.data ? data.data.message : data.error}`);
      }
    } catch (error) {
      setLlmOutput('Sunucu bağlantı hatası. Backend çalışıyor mu?');
    }
    setIsRunning(false);
  };

  // Adım 2: Kodu Üret (Coder)
  const startCoder = async () => {
    if (!targetFile.trim()) {
      alert("Lütfen kodu yazdıracağınız hedef dosya yolunu belirtin.");
      return;
    }

    setIsCoding(true);
    setCoderOutput('Gemini (Uygulayıcı) kodu yazıyor, lütfen bekleyin...\n\n');

    try {
      const response = await fetch('http://localhost:3000/api/run-coder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKey,
          approvedPlan: llmOutput,
          targetFile: targetFile
        })
      });

      const data = await response.json();
      if (response.ok && data.data.status === 'success') {
        setCoderOutput(data.data.output);
      } else {
        setCoderOutput(`Hata oluştu:\n${data.data ? data.data.message : data.error}`);
      }
    } catch (error) {
      setCoderOutput('Sunucu bağlantı hatası.');
    }
    setIsCoding(false);
  };

  return (
    <div className="app-container animate-fade-in">
      <header className="header">
        <div className="logo">VibeCoding Framework</div>
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            style={{
              background: 'transparent', border: '1px solid var(--border-color)', 
              color: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: '8px',
              cursor: 'pointer', fontSize: '1.2rem'
            }}
            title="Ayarlar"
          >
            ⚙️
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setActiveWorkflow(null);
              setPromptContent('');
              setLlmOutput('');
              setCoderOutput('');
            }}
          >
            Yeni Oturum Başlat
          </button>
        </nav>
      </header>

      {showSettings && (
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--accent-primary)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Ayarlar</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Gemini API Key</label>
            <input 
              type="password" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'white', width: '100%', maxWidth: '400px' }}
            />
            <button onClick={saveApiKey} className="btn btn-primary" style={{ width: 'fit-content', marginTop: '0.5rem' }}>Kaydet ve Kapat</button>
          </div>
        </div>
      )}

      <main>
        <div className="grid-layout">
          <div className="glass-card">
            <h2 className="section-title">İş Akışları</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div 
                style={{ 
                  padding: '1rem', borderRadius: '8px', 
                  background: activeWorkflow === 'Feature Branch' ? 'var(--glass-bg)' : 'var(--bg-dark)',
                  border: '1px solid', borderColor: activeWorkflow === 'Feature Branch' ? 'var(--accent-primary)' : 'var(--border-color)',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveWorkflow('Feature Branch')}
              >
                <h4>Feature Branch Yaratma</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Adım 1: Architect Planı → Adım 2: Coder Üretimi</p>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
            <h2 className="section-title">Bağlam Hijyeni (Aktif Oturum)</h2>
            {activeWorkflow ? (
              <div>
                <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>Çalışan İş Akışı: {activeWorkflow}</h3>
                
                {/* ADIM 1: ARCHITECT */}
                <div style={{ marginBottom: '1.5rem', background: 'var(--bg-dark)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Adım 1: Mimari Planlama (Architect)</h4>
                  <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Feature Request:</label>
                  <textarea 
                    value={featureRequest}
                    onChange={(e) => setFeatureRequest(e.target.value)}
                    placeholder="Örn: Uygulamaya karanlık mod butonu ekle..."
                    style={{ width: '100%', minHeight: '60px', padding: '0.75rem', borderRadius: '4px', background: '#1a1d24', color: 'white', border: '1px solid var(--border-color)', marginBottom: '1rem' }}
                  />
                  <button 
                    onClick={startAutomation}
                    disabled={isRunning}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    {isRunning ? '⏳ Plan Hazırlanıyor...' : '🚀 Adım 1: Planı Üret'}
                  </button>
                </div>
                
                {llmOutput && !llmOutput.includes('Hata') && (
                  <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--accent-primary)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ color: 'var(--accent-primary)' }}>🤖 Onaylanmış Mimari Plan</h4>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'Inter', fontSize: '0.9rem', color: '#f3f4f6', maxHeight: '300px', overflowY: 'auto' }}>
                      {llmOutput}
                    </div>
                  </div>
                )}

                {/* ADIM 2: CODER (Sadece Plan Varsa Açılır) */}
                {llmOutput && !llmOutput.includes('Hata') && !isRunning && (
                  <div style={{ marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid #10b981', animation: 'fadeIn 0.5s' }}>
                    <h4 style={{ color: '#10b981', marginBottom: '1rem' }}>Adım 2: Kod Üretimi (Coder)</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Plan onaylandı. Şimdi bu plan doğrultusunda değiştirmek/yaratmak istediğiniz hedef dosyayı belirleyin. Uygulayıcı (Coder) sözleşmesi devreye girerek sıfır gevezelikle kodu yazacaktır.
                    </p>
                    <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Hedef Dosya (target_file):</label>
                    <input 
                      type="text"
                      value={targetFile}
                      onChange={(e) => setTargetFile(e.target.value)}
                      placeholder="Örn: src/components/ThemeToggle.jsx"
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#1a1d24', color: 'white', border: '1px solid var(--border-color)', marginBottom: '1rem' }}
                    />
                    <button 
                      onClick={startCoder}
                      disabled={isCoding}
                      className="btn"
                      style={{ background: '#10b981', color: 'white', width: '100%', fontWeight: 'bold' }}
                    >
                      {isCoding ? '⏳ Kod Yazılıyor...' : '💻 Adım 2: Kodu Üret'}
                    </button>
                  </div>
                )}

                {/* CODER ÇIKTISI */}
                {coderOutput && (
                  <div style={{ background: '#1a1d24', padding: '1.5rem', borderRadius: '8px', border: '1px solid #10b981', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ color: '#10b981' }}>📝 Üretilen Kod</h4>
                      <button 
                        onClick={() => copyToClipboard(coderOutput, setCopyStatus)}
                        className="btn"
                        style={{ background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        {copyStatus === 'Promptu Panoya Kopyala' ? 'Kodu Kopyala' : copyStatus}
                      </button>
                    </div>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e5e7eb', maxHeight: '400px', overflowY: 'auto', background: '#0f1115', padding: '1rem', borderRadius: '4px' }}>
                      {coderOutput}
                    </pre>
                  </div>
                )}

              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                Şu an aktif bir oturum yok. Yukarıdan bir iş akışı seçin.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
