require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Inicialização Firebase
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DB_URL
        });
        console.log("[NEXUS] Firebase Conectado.");
    }
} catch (e) { console.error("Erro Firebase:", e.message); }

const db = admin.database();

// Middleware de Segurança
const securityCheck = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey && apiKey === process.env.NEXUS_API_KEY) {
        next();
    } else {
        console.log("[ALERTA] Tentativa de acesso sem token!");
        res.status(403).json({ error: "ACESSO NEGADO" });
    }
};

// ROTA QUE ESTAVA FALTANDO: Receber telemetria do Termux
app.post('/api/telemetry/termux', securityCheck, async (req, res) => {
    if (admin.apps.length) {
        await db.ref('telemetry/termux_device').set({
            ...req.body,
            last_seen: admin.database.ServerValue.TIMESTAMP
        });
        console.log("[NEXUS] Telemetria Termux recebida e salva.");
    }
    res.json({ status: "SECURE_RECEIVED" });
});

app.get('/api/health', async (req, res) => {
    const metrics = {
        status: "ONLINE",
        uptime: process.uptime(),
        load: (os.loadavg()[0] / os.cpus().length).toFixed(2),
        timestamp: admin.database.ServerValue.TIMESTAMP
    };
    if (admin.apps.length) { await db.ref('telemetry/current').set(metrics); }
    res.json(metrics);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEXUS] Engine operacional na porta ${PORT}`);
});
