import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const socket = io('http://localhost:3000');

function App() {
    const [latest, setLatest] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetch('/api/results?limit=50')
            .then(res => res.json())
            .then(setHistory);
        
        socket.on('new_diagnosis', (data) => {
            setLatest(data);
            setHistory(prev => [data, ...prev.slice(0, 49)]);
        });
        
        return () => socket.disconnect();
    }, []);

    return (
        <div style={{ padding: 20, fontFamily: 'Arial' }}>
            <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>
                🦷 OSCAR Dashboard - Deteksi Dini OSCC
            </h1>
            
            {/* Card Hasil Terbaru */}
            {latest && (
                <div style={{
                    backgroundColor: latest.pred_class === 'OSCC' ? '#ff4444' : '#44ff44',
                    padding: 20,
                    borderRadius: 10,
                    textAlign: 'center',
                    marginBottom: 20
                }}>
                    <h2>📊 Diagnosis Terbaru</h2>
                    <h1>{latest.pred_class}</h1>
                    <p>Probabilitas OSCC: {(latest.prob_oscc * 100).toFixed(1)}%</p>
                    <p>Waktu: {new Date(latest.timestamp).toLocaleString()}</p>
                </div>
            )}
            
            {/* Grafik Tren */}
            <div style={{ background: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 20 }}>
                <h3>📈 Tren Biomarker (50 Diagnosis Terakhir)</h3>
                <LineChart width={800} height={300} data={history.slice().reverse()}>
                    <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleDateString()} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="mean_mirna" stroke="#8884d8" name="miRNA-31" />
                    <Line yAxisId="left" type="monotone" dataKey="mean_il8" stroke="#82ca9d" name="IL-8" />
                    <Line yAxisId="right" type="monotone" dataKey="mean_laktat" stroke="#ff7300" name="Asam Laktat" />
                </LineChart>
            </div>
            
            {/* Riwayat Tabel */}
            <div style={{ background: '#f5f5f5', padding: 15, borderRadius: 10 }}>
                <h3>📋 Riwayat Diagnosis</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#ddd' }}>
                            <th style={{ padding: 8 }}>Waktu</th><th>Hasil</th><th>Probabilitas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.slice(0, 20).map(row => (
                            <tr key={row.id} style={{ borderBottom: '1px solid #ccc' }}>
                                <td>{new Date(row.timestamp).toLocaleString()}</td>
                                <td style={{ color: row.pred_class === 'OSCC' ? 'red' : 'green' }}>
                                    {row.pred_class}
                                </td>
                                <td>{((row.prob_oscc || 0) * 100).toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;