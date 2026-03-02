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
        <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="glass p-6" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Map size={20} color="var(--primary)" />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Kilometry (Suma)</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.totalKm} km</div>
                </div>
                <div className="glass p-6" style={{ borderLeft: '4px solid var(--secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Fuel size={20} color="var(--secondary)" />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Paliwo (Średnie)</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.avgFuel} L/100km</div>
                </div>
                <div className="glass p-6" style={{ borderLeft: '4px solid var(--accent)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Activity size={20} color="var(--accent)" />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ostatnie wpisy</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{history.length}</div>
                </div>
            </div>

            <div className="glass p-6 mb-24">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.2rem' }}>Ostatnie Karty Drogowe</h2>
                </div>

                {history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                        <FileText size={48} style={{ opacity: 0.2, marginBottom: '16px', marginLeft: 'auto', marginRight: 'auto' }} />
                        <p>Brak zapisanych kart. Zrób zdjęcie pierwszej karty!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {history.slice(0, 5).map((item) => (
                            <div
                                key={item.id}
                                className="glass p-4 karta-row"
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <div onClick={() => onEdit(item)} style={{ cursor: 'pointer', flex: 1 }}>
                                    <div style={{ fontWeight: '600' }}>{item.registrationNumber || 'Brak tablic'}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(item.dateCreated).toLocaleDateString()}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                        style={{ background: 'transparent', color: 'var(--accent)', border: 'none', padding: '4px' }}
                                    >
                                        <Trash2 size={18} />
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
