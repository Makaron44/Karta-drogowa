import React, { useMemo } from 'react';
import { Plus, ChevronRight, Activity, Fuel, Map, FileText, Trash2 } from 'lucide-react';

const Dashboard = ({ history, onNewScan, onEdit, onDelete }) => {
    const stats = useMemo(() => {
        let totalKm = 0;
        let totalFuel = 0;

        history.forEach(karta => {
            const rows = karta.rows;
            if (rows.length > 0) {
                const start = parseFloat(rows[0].odometer) || 0;
                const end = parseFloat(rows[rows.length - 1].odometer) || 0;
                if (end > start) totalKm += (end - start);

                rows.forEach(r => {
                    totalFuel += (parseFloat(r.fuelDkv) || 0) + (parseFloat(r.fuelIds) || 0) + (parseFloat(r.fuelLotos) || 0);
                });
            }
        });

        const avgFuel = totalKm > 0 ? ((totalFuel / totalKm) * 100).toFixed(1) : '0';

        return { totalKm, avgFuel };
    }, [history]);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '100px' }}>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', background: 'linear-gradient(to right, var(--text), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px' }}>
                        Karta Drogowa AI
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Twój inteligentny asystent kierowcy</p>
                </div>
                <div className="glass" style={{ padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
                    <Activity size={20} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '32px' }}>
                <div className="glass" style={{ borderLeft: '4px solid var(--primary)', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Map size={18} color="var(--primary)" />
                        <span className="stat-label">Kilometry (Suma)</span>
                    </div>
                    <div className="stat-value">{stats.totalKm} <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>km</span></div>
                </div>
                <div className="glass" style={{ borderLeft: '4px solid var(--secondary)', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Fuel size={18} color="var(--secondary)" />
                        <span className="stat-label">Paliwo (Średnie)</span>
                    </div>
                    <div className="stat-value">{stats.avgFuel} <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>L/100</span></div>
                </div>
                <div className="glass" style={{ borderLeft: '4px solid var(--accent)', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Activity size={18} color="var(--accent)" />
                        <span className="stat-label">Ostatnie wpisy</span>
                    </div>
                    <div className="stat-value">{history.length}</div>
                </div>
            </div>

            <div className="glass" style={{ padding: '20px' }}>
                <h2 className="section-title">
                    <FileText size={20} color="var(--primary)" />
                    Ostatnie Karty Drogowe
                </h2>

                {history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                        <FileText size={48} style={{ opacity: 0.1, marginBottom: '16px', marginLeft: 'auto', marginRight: 'auto' }} />
                        <p>Brak zapisanych kart. Zrób zdjęcie pierwszej karty!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {history.slice(0, 5).map((item) => (
                            <div
                                key={item.id}
                                className="glass karta-row"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px',
                                    backgroundColor: 'rgba(255,255,255,0.02)'
                                }}
                            >
                                <div onClick={() => onEdit(item)} style={{ cursor: 'pointer', flex: 1 }}>
                                    <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '2px' }}>{item.registrationNumber || 'Brak tablic'}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '10px' }}>
                                        <span>{new Date(item.dateCreated).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{item.rows.length} przystanków</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                        style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)', borderRadius: '8px', padding: '8px' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <ChevronRight size={20} color="var(--text-muted)" onClick={() => onEdit(item)} style={{ cursor: 'pointer' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
