import React, { useState } from 'react';
import { Save, X, Camera, Plus, Trash2, Loader2, Download } from 'lucide-react';
import { KARTA_COLUMNS } from '../constants/kartaSchema';
import { analyzeKarta } from '../services/gemini';
import { generateKartaPDF } from '../services/pdf';

const LogForm = ({ data, setData, onSave, onCancel }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const expandAll = () => {
        const allExpanded = {};
        data.rows.forEach(row => {
            allExpanded[row.id] = true;
        });
        setExpandedRows(allExpanded);
    };

    const collapseAll = () => {
        setExpandedRows({});
    };

    const handleInputChange = (field, value) => {
        setData({ ...data, [field]: value });
    };

    const handleRowChange = (index, field, value) => {
        const newRows = [...data.rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setData({ ...data, rows: newRows });
    };

    const addRow = () => {
        setData({
            ...data,
            rows: [
                ...data.rows,
                {
                    id: crypto.randomUUID(),
                    date: '',
                    arrivalTime: '',
                    departureTime: '',
                    postcode: '',
                    city: '',
                    company: '',
                    loading: false,
                    unloading: false,
                    exchange: false,
                    border: false,
                    stoppage: false,
                    notes: '',
                    tons: '',
                    fuelDkv: '',
                    fuelIds: '',
                    fuelLotos: '',
                    fuelAdBlue: '',
                    odometer: '',
                }
            ]
        });
    };

    const removeRow = (index) => {
        if (data.rows.length > 1) {
            const newRows = data.rows.filter((_, i) => i !== index);
            setData({ ...data, rows: newRows });
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            setError('Najpierw dodaj klucz API Gemini w ustawieniach!');
            return;
        }

        setIsScanning(true);
        setError(null);
        try {
            const result = await analyzeKarta(file, apiKey);

            // Merge AI result with existing data structure
            setData(prev => ({
                ...prev,
                driverName: result.driverName || prev.driverName,
                registrationNumber: result.registrationNumber || prev.registrationNumber,
                trailerNumber: result.trailerNumber || prev.trailerNumber,
                rows: result.rows ? result.rows.map(r => ({ ...r, id: crypto.randomUUID() })) : prev.rows
            }));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsScanning(false);
        }
    };

    const handleDownloadPDF = () => {
        generateKartaPDF(data);
    };

    return (
        <div className="animate-fade-in mb-24">
            <div className="glass p-6 mb-6">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.2rem' }}>Nowa Karta Drogowa</h2>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={onCancel} className="glass" style={{ padding: '8px 16px', color: 'var(--text-muted)' }}>
                            <X size={18} />
                        </button>
                        <button onClick={onSave} style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '8px 24px', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Save size={18} /> Zapisz
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="glass p-4 mb-4" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div className="glass p-3">
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nazwisko kierowcy</label>
                        <input
                            value={data.driverName}
                            onChange={(e) => handleInputChange('driverName', e.target.value)}
                            placeholder="Wpisz nazwisko"
                            style={{ textAlign: 'left', fontSize: '1rem' }}
                        />
                    </div>
                    <div className="glass p-3">
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nr rejestracyjny</label>
                        <input
                            value={data.registrationNumber}
                            onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                            placeholder="P2 4K36S"
                            style={{ textAlign: 'left', fontSize: '1rem' }}
                        />
                    </div>
                    <div className="glass p-3">
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nr naczepy</label>
                        <input
                            value={data.trailerNumber}
                            onChange={(e) => handleInputChange('trailerNumber', e.target.value)}
                            placeholder="P2 366VS"
                            style={{ textAlign: 'left', fontSize: '1rem' }}
                        />
                    </div>
                    <div className="glass p-3">
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Stan paliwa (początek)</label>
                        <input
                            type="number"
                            value={data.initialFuel}
                            onChange={(e) => handleInputChange('initialFuel', e.target.value)}
                            placeholder="np. 400"
                            style={{ textAlign: 'left', fontSize: '1rem' }}
                        />
                    </div>
                    <div className="glass p-3">
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Drugi kierowca</label>
                        <input
                            value={data.driver2Name}
                            onChange={(e) => handleInputChange('driver2Name', e.target.value)}
                            placeholder="Wpisz nazwisko"
                            style={{ textAlign: 'left', fontSize: '1rem' }}
                        />
                    </div>
                    <div className="glass p-3" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Ogólne uwagi</label>
                        <input
                            value={data.generalNotes}
                            onChange={(e) => handleInputChange('generalNotes', e.target.value)}
                            placeholder="Dodatkowe informacje..."
                            style={{ textAlign: 'left', fontSize: '1rem' }}
                        />
                    </div>
                </div>


                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <label className="glass" style={{ padding: '20px', cursor: isScanning ? 'not-allowed' : 'pointer', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--primary)', border: '2px dashed var(--primary)' }}>
                        {isScanning ? <Loader2 className="animate-spin" size={32} /> : <Camera size={32} />}
                        <span style={{ fontWeight: '600' }}>{isScanning ? 'Analizuję zdjęcie...' : 'Skanuj zdjęcie (AI)'}</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={isScanning} />
                    </label>

                    <button
                        onClick={handleDownloadPDF}
                        className="glass"
                        style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--secondary)' }}
                    >
                        <Download size={32} />
                        <span style={{ fontWeight: '600' }}>Generuj PDF</span>
                    </button>
                </div>

                <div className="mobile-only" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button onClick={expandAll} className="glass" style={{ flex: 1, padding: '8px', fontSize: '0.8rem', color: 'var(--primary)' }}>
                        Rozwiń wszystko
                    </button>
                    <button onClick={collapseAll} className="glass" style={{ flex: 1, padding: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Zwiń wszystko
                    </button>
                </div>
            </div>

            <div className="karta-container">
                <div className="desktop-only glass" style={{ overflowX: 'auto', padding: '1px' }}>
                    <table className="karta-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>Lp.</th>
                                {KARTA_COLUMNS.map(col => (
                                    <th key={col.key}>{col.label}</th>
                                ))}
                                <th style={{ width: '40px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.rows.map((row, index) => (
                                <tr key={row.id} className="karta-row">
                                    <td>{index + 1}</td>
                                    {KARTA_COLUMNS.map(col => (
                                        <td key={col.key}>
                                            {col.type === 'checkbox' ? (
                                                <input
                                                    type="checkbox"
                                                    checked={row[col.key]}
                                                    onChange={(e) => handleRowChange(index, col.key, e.target.checked)}
                                                    style={{ width: '18px', height: '18px' }}
                                                />
                                            ) : (
                                                <input
                                                    value={row[col.key]}
                                                    onChange={(e) => handleRowChange(index, col.key, e.target.value)}
                                                    placeholder="-"
                                                />
                                            )}
                                        </td>
                                    ))}
                                    <td>
                                        <button onClick={() => removeRow(index)} style={{ background: 'transparent', color: 'var(--accent)' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.rows.map((row, index) => {
                        const isExpanded = expandedRows[row.id];
                        return (
                            <div key={row.id} className={`glass card-collapsible ${isExpanded ? 'expanded' : ''}`} style={{ overflow: 'hidden' }}>
                                <div
                                    onClick={() => toggleRow(row.id)}
                                    style={{
                                        padding: '12px 16px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        background: isExpanded ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--primary)',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {index + 1}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                                            {row.city || 'Brak miasta'}
                                            <span style={{ fontWeight: '400', color: 'var(--text-muted)', marginLeft: '8px' }}>
                                                {row.arrivalTime || row.departureTime || '--:--'}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>
                                        {isExpanded ? 'Zwiń' : 'Rozwiń'}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }} className="animate-fade-in">
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            {KARTA_COLUMNS.map(col => (
                                                <div key={col.key} style={{ gridColumn: col.key === 'company' || col.key === 'notes' ? '1 / -1' : 'auto' }}>
                                                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>{col.label}</label>
                                                    {col.type === 'checkbox' ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={row[col.key]}
                                                            onChange={(e) => handleRowChange(index, col.key, e.target.checked)}
                                                            style={{ width: '24px', height: '24px', marginTop: '4px' }}
                                                        />
                                                    ) : (
                                                        <input
                                                            value={row[col.key]}
                                                            onChange={(e) => handleRowChange(index, col.key, e.target.value)}
                                                            placeholder="..."
                                                            style={{ fontSize: '0.9rem', width: '100%', padding: '4px 0' }}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px dotted var(--border)' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeRow(index); }}
                                                className="glass"
                                                style={{ color: 'var(--accent)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}
                                            >
                                                <Trash2 size={16} /> Usuń przystanek
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={addRow}
                    className="glass"
                    style={{ width: '100%', padding: '16px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px' }}
                >
                    <Plus size={20} /> Dodaj kolejny przystanek
                </button>
            </div>
        </div >
    );
};

export default LogForm;
