import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, ExternalLink } from 'lucide-react';

const Settings = ({ onBack }) => {
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setApiKey(savedKey);
    }, []);

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="animate-fade-in mb-24">
            <div className="glass p-8 max-width-600 mx-auto">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Key size={24} color="var(--primary)" /> Ustawienia AI
                </h2>

                <div className="mb-6">
                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Gemini API Key
                    </label>
                    <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '12px' }}>
                        <input
                            type={showKey ? "text" : "password"}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Wklej swój klucz tutaj..."
                            style={{ textAlign: 'left', flex: 1, border: 'none', background: 'transparent' }}
                        />
                        <button
                            onClick={() => setShowKey(!showKey)}
                            style={{ background: 'transparent', color: 'var(--text-muted)', padding: '0 8px' }}
                        >
                            {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        Klucz jest przechowywany lokalnie w Twojej przeglądarce i służy do analizy zdjęć kart drogowych.
                    </p>
                </div>

                <div className="glass p-4 mb-8" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)' }}>
                    <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Nie masz klucza?</p>
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}
                    >
                        Pobierz darmowy klucz w Google AI Studio <ExternalLink size={14} />
                    </a>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        onClick={handleSave}
                        style={{
                            backgroundColor: isSaved ? '#10b981' : 'var(--primary)',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: 'var(--radius)',
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <Save size={18} /> {isSaved ? 'Zapisano!' : 'Zapisz klucz'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
