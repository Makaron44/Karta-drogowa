import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LogForm from './components/LogForm';
import Settings from './components/Settings';
import { INITIAL_KARTA_DATA } from './constants/kartaSchema';
import { Camera, FileText, History, Settings as SettingsIcon, LogOut, ChevronLeft, Trash2 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [kartaData, setKartaData] = useState(INITIAL_KARTA_DATA);
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount and migrate (add IDs if missing)
  useEffect(() => {
    const savedHistory = localStorage.getItem('karta_history');
    if (savedHistory) {
      let parsed = JSON.parse(savedHistory);
      // Migration: Ensure every entry has a top-level ID
      const migrated = parsed.map(item => ({
        ...item,
        id: item.id || crypto.randomUUID()
      }));
      setHistory(migrated);
      if (JSON.stringify(migrated) !== savedHistory) {
        localStorage.setItem('karta_history', JSON.stringify(migrated));
      }
    }
  }, []);

  const saveToHistory = (data) => {
    const finalData = {
      ...data,
      id: data.id || crypto.randomUUID(),
      dateCreated: data.dateCreated || new Date().toISOString()
    };

    const existingIndex = history.findIndex(item => item.id === finalData.id);
    let newHistory;

    if (existingIndex > -1) {
      newHistory = [...history];
      newHistory[existingIndex] = finalData;
    } else {
      newHistory = [finalData, ...history];
    }

    setHistory(newHistory);
    localStorage.setItem('karta_history', JSON.stringify(newHistory));
  };

  const deleteFromHistory = (id) => {
    if (!id) return;
    if (window.confirm('Czy na pewno chcesz usunąć tę kartę z historii?')) {
      const newHistory = history.filter(item => item.id !== id);
      setHistory(newHistory);
      localStorage.setItem('karta_history', JSON.stringify(newHistory));
    }
  };

  const handleNewScan = () => {
    setKartaData({
      ...INITIAL_KARTA_DATA,
      id: crypto.randomUUID(),
      dateCreated: new Date().toISOString(),
      rows: [...INITIAL_KARTA_DATA.rows]
    });
    setActiveTab('scan');
  };

  const handleEdit = (item) => {
    setKartaData(item);
    setActiveTab('scan');
  };

  return (
    <div className="app-container">
      <header className="glass shadow-lg mb-8 p-6 flex items-center animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {activeTab !== 'dashboard' && (
            <button onClick={() => setActiveTab('dashboard')} className="glass" style={{ padding: '8px', color: 'var(--text-muted)' }}>
              <ChevronLeft size={20} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '4px' }}>Karta Drogowa AI</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Twój inteligentny asystent kierowcy</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('settings')}
            className="glass"
            style={{ padding: '10px', color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text)' }}
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </header>

      <main style={{ paddingBottom: '100px' }}>
        {activeTab === 'dashboard' && (
          <Dashboard
            history={history}
            onNewScan={handleNewScan}
            onEdit={handleEdit}
            onDelete={deleteFromHistory}
          />
        )}
        {activeTab === 'scan' && (
          <LogForm
            data={kartaData}
            setData={setKartaData}
            onSave={() => {
              saveToHistory(kartaData);
              setActiveTab('dashboard');
            }}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}
        {activeTab === 'settings' && (
          <Settings onBack={() => setActiveTab('dashboard')} />
        )}
        {activeTab === 'history' && (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '20px' }}>Historia Kart</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.map(item => (
                <div key={item.id} className="glass p-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div onClick={() => handleEdit(item)} style={{ cursor: 'pointer', flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{item.registrationNumber || 'Brak NR'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(item.dateCreated).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button onClick={() => handleEdit(item)} style={{ background: 'transparent', color: 'var(--primary)' }}>
                      <ChevronLeft size={20} style={{ transform: 'rotate(180deg)' }} />
                    </button>
                    <button onClick={() => deleteFromHistory(item.id)} style={{ background: 'transparent', color: 'var(--accent)' }}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <nav className="glass shadow-2xl" style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '500px', display: 'flex', justifyContent: 'space-around', padding: '12px', zIndex: 1000 }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{ color: activeTab === 'dashboard' || activeTab === 'scan' ? 'var(--primary)' : 'var(--text-muted)', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <FileText size={20} />
          <span style={{ fontSize: '0.7rem' }}>Karty</span>
        </button>
        <button
          onClick={handleNewScan}
          className="shadow-lg"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            marginTop: '-30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid var(--background)'
          }}
        >
          <Camera size={28} />
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{ color: activeTab === 'history' ? 'var(--primary)' : 'var(--text-muted)', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <History size={20} />
          <span style={{ fontSize: '0.7rem' }}>Historia</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
