require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
// O Render exige que usemos a porta definida por eles na variável PORT
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Remove possíveis quebras de linha extras que corrompem o JSON
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DB_URL
        });
        console.log("[NEXUS] Firebase Admin Conectado.");
    } else {
        console.log("[NEXUS] FIREBASE_SERVICE_ACCOUNT não encontrada.");
    }
} catch (e) {
    console.error("[NEXUS] Erro ao iniciar Firebase:", e.message);
}

app.get('/api/health', (req, res) => {
    res.json({
        status: "ONLINE",
        uptime: process.uptime(),
        timestamp: Date.now(),
        node_version: process.version
    });
});

// Rota raiz para o Render detectar que o servidor está vivo
app.get('/', (req, res) => {
    res.send('Nexux SRE Engine is Running...');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEXUS] Servidor rodando na porta ${PORT}`);
});
