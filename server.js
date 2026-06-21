require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. Inicialização Firebase
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DB_URL
        });
        console.log("[NEXUS] Firebase Conectado com sucesso.");
    }
} catch (e) {
    console.error("[NEXUS] Erro Firebase:", e.message);
}

const db = admin.database();

// 2. ROTA PRINCIPAL (Resolve o erro 'Cannot GET /')
app.get('/', (req, res) => {
    res.send('<h1>NEXUS SRE ENGINE</h1><p>Status: OPERACIONAL</p><p>Acesse o Dashboard no GitHub Pages.</p>');
});

// 3. Endpoint de Telemetria Termux (Seguro)
app.post('/api/telemetry/termux', async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey === process.env.NEXUS_API_KEY) {
        if (admin.apps.length) {
            await db.ref('telemetry/termux_device').set({
                ...req.body,
                last_seen: admin.database.ServerValue.TIMESTAMP
            });
        }
        res.json({ status: "SECURE_RECEIVED" });
    } else {
        res.status(403).json({ error: "ACESSO NEGADO" });
    }
});

// 4. Endpoint de Saúde do Sistema
app.get('/api/health', async (req, res) => {
    const metrics = {
        status: "ONLINE",
        uptime: process.uptime(),
        load: (os.loadavg()[0] / os.cpus().length).toFixed(2),
        timestamp: admin.database.ServerValue.TIMESTAMP
    };
    if (admin.apps.length) {
        await db.ref('telemetry/current').set(metrics);
    }
    res.json(metrics);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEXUS] Servidor ativo na porta ${PORT}`);
});
