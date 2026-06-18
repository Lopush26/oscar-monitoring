// const express = require('express');
// const mysql = require('mysql2');
// const http = require('http');
// const socketio = require('socket.io');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server, { cors: { origin: "*" } });

// app.use(cors());
// app.use(express.json());

// // Koneksi ke MySQL
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'oscar_db'
// });

// db.connect(err => {
//     if (err) throw err;
//     console.log('✅ MySQL Connected');
// });

// // **Endpoint utama: menerima data dari Raspberry Pi**
// app.post('/api/diagnosis', (req, res) => {
//     const { pred_class, prob_oscc, features, timestamp, lat, lon } = req.body;
    
//     const sql = `INSERT INTO results 
//                  (timestamp, pred_class, prob_oscc, mean_mirna, mean_il8, mean_laktat, lat, lon) 
//                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
//     db.query(sql, [
//         timestamp, pred_class, prob_oscc,
//         features?.mean_mirna || null,
//         features?.mean_il8 || null,
//         features?.mean_laktat || null,
//         lat || null, lon || null
//     ], (err) => {
//         if (err) {
//             console.error('❌ Insert error:', err);
//             return res.status(500).json({ error: err.message });
//         }
        
//         // ★ BROADCAST KE SEMUA CLIENT (real-time update)
//         io.emit('new_diagnosis', { pred_class, prob_oscc, timestamp });
//         console.log(`📡 Broadcast: ${pred_class} (${prob_oscc})`);
//         res.json({ status: 'ok' });
//     });
// });

// // Endpoint: ambil data historis
// app.get('/api/results', (req, res) => {
//     const limit = req.query.limit || 50;
//     db.query('SELECT * FROM results ORDER BY timestamp DESC LIMIT ?', [limit], 
//         (err, rows) => {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json(rows);
//         });
// });

// // Endpoint: data untuk peta
// app.get('/api/map-data', (req, res) => {
//     db.query('SELECT lat, lon, pred_class, timestamp FROM results WHERE lat IS NOT NULL', 
//         (err, rows) => {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json(rows);
//         });
// });

// // Socket.io connection
// io.on('connection', (socket) => {
//     console.log('🟢 Client connected:', socket.id);
//     socket.on('disconnect', () => console.log('🔴 Client disconnected'));
// });

// // Jalankan server
// const PORT = 3000;
// server.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Penyimpanan sementara (tanpa database)
let diagnosisHistory = [];

// Endpoint menerima data dari Raspberry Pi
app.post('/api/diagnosis', (req, res) => {
    const { pred_class, prob_oscc, features, timestamp } = req.body;
    
    const newData = {
        id: diagnosisHistory.length + 1,
        pred_class,
        prob_oscc,
        mean_mirna: features?.mean_mirna || Math.random() * 100,
        mean_il8: features?.mean_il8 || Math.random() * 80,
        mean_laktat: features?.mean_laktat || Math.random() * 5,
        timestamp: timestamp || new Date().toISOString()
    };
    
    diagnosisHistory.unshift(newData); // tambah di awal
    if (diagnosisHistory.length > 50) diagnosisHistory.pop(); // simpan 50 terakhir
    
    // Broadcast ke semua client
    io.emit('new_diagnosis', newData);
    console.log(`📡 Diagnosis: ${pred_class} (${(prob_oscc*100).toFixed(1)}%)`);
    
    res.json({ status: 'ok', id: newData.id });
});

// Endpoint ambil riwayat
app.get('/api/results', (req, res) => {
    res.json(diagnosisHistory);
});

// Endpoint health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', total: diagnosisHistory.length });
});

// Socket connection
io.on('connection', (socket) => {
    console.log('🟢 Client terhubung:', socket.id);
    socket.on('disconnect', () => console.log('🔴 Client putus'));
});

// Jalankan server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server OSCAR berjalan di http://localhost:${PORT}`);
});