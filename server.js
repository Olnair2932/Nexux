require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- GPS: CONFIGURAÇÃO DE CAMINHOS ABSOLUTOS ---
const RAIZ_WEB = "/data/data/com.termux/files/home/scripts/web_base";
const RAIZ_ARSENAL = "/data/data/com.termux/files/home/sentinela_dev/scripts";

app.use(express.static('public'));
app.use(express.json());

// 1. Inicialização do Firebase
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DB_URL
        });
        console.log("[NEXUS-SRE] Firebase Conectado com Sucesso.");
    }

    const db = admin.database();

    // --- OUVINTE 1: NEXUS IA (Módulo Rosa - Atualiza Site) ---
    db.ref('nexus/comandos').on('child_added', (snapshot) => {
        const cmd = snapshot.val();
        if (cmd && cmd.executado === false) {
            console.log(`[IA-SITE] Recebido: ${cmd.texto}`);

            // Executa nexus.sh dentro da pasta web_base
            exec(`./nexus.sh "${cmd.texto}"`, { cwd: RAIZ_WEB }, (err, stdout, stderr) => {
                if (err) {
                    console.error(`[IA-ERRO] ${err.message}`);
                    return;
                }
                console.log(`[IA-OK] ${stdout}`);
                snapshot.ref.update({ 
                    executado: true, 
                    processado_em: new Date().toISOString() 
                });
            });
        }
    });

    // --- OUVINTE 2: ARSENAL (Módulo Azul - Executa Scripts Shell) ---
    db.ref('nexus/scripts').on('child_added', (snapshot) => {
        const cmd = snapshot.val();
        if (cmd && cmd.executado === false) {
            const scriptName = cmd.arquivo || cmd.texto;
            console.log(`[ARSENAL] Executando: ${scriptName}`);

            // Executa scripts dentro da pasta sentinela_dev/scripts
            exec(`./${scriptName}`, { cwd: RAIZ_ARSENAL }, (err, stdout, stderr) => {
                if (err) {
                    console.error(`[ARSENAL-ERRO] ${err.message}`);
                    return;
                }
                console.log(`[ARSENAL-OK] ${stdout}`);
                snapshot.ref.update({ 
                    executado: true, 
                    processado_em: new Date().toISOString() 
                });
            });
        }
    });

} catch (e) {
    console.error("[NEXUS-FATAL] Erro ao iniciar motor:", e.message);
}

// Rota de Status
app.get('/status', (req, res) => {
    res.json({ system: "NEXUS_SRE", status: "ONLINE", timestamp: Date.now() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEXUS-SRE] Engine ativa na porta ${PORT}`);
    console.log(`[GPS] Web Base: ${RAIZ_WEB}`);
    console.log(`[GPS] Arsenal: ${RAIZ_ARSENAL}`);
});
