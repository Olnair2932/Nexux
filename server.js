require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const os = require('os'); // Módulo para ler o sistema operacional

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DB_URL
        });
        console.log("[NEXUS] SRE: Firebase Conectado.");
    }
} catch (e) {
    console.error("[NEXUS] Erro de Inicialização:", e.message);
}

const db = admin.database();

// Função para calcular carga real (0 a 1)
const getSystemLoad = () => {
    const load = os.loadavg()[0]; // Carga média de 1 minuto
    return (load / os.cpus().length).toFixed(2);
};

app.get('/api/health', async (req, res) => {
    const metrics = {
        status: "ONLINE",
        uptime: process.uptime(),
        load: getSystemLoad(),
        memory: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + "MB",
        timestamp: admin.database.ServerValue.TIMESTAMP
    };

    if (admin.apps.length) {
        await db.ref('telemetry/current').set(metrics);
        // Salva histórico apenas se a carga for alta (Economia de DB)
        if (metrics.load > 0.8) {
            await db.ref('telemetry/alerts').push({ ...metrics, msg: "HIGH_LOAD_DETECTED" });
        }
    }

    res.json(metrics);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEXUS] Engine operacional na porta ${PORT}`);
});
