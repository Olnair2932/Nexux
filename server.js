require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// --- GPS: CAMINHO ABSOLUTO ATUALIZADO ---
const RAIZ_WEB = "/data/data/com.termux/files/home/ia_termux/arsenal/scripts/web_base";

app.use(express.static('public'));
app.use(express.json());

// Firebase
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DB_URL
    });

    const db = admin.database();
    console.log("[NEXUS-SRE] Ouvindo Firebase em: nexus/comandos");

    db.ref('nexus/comandos').on('child_added', (snapshot) => {
        const cmd = snapshot.val();
        if (cmd && cmd.executado === false) {
            console.log(`[IA] Comando Recebido: ${cmd.texto}`);

            // Executa com o CWD na pasta profunda do arsenal
            exec(`./nexus.sh "${cmd.texto}"`, { cwd: RAIZ_WEB }, (err, stdout, stderr) => {
                if (err) {
                    console.error(`[ERRO] ${err.message}`);
                    return;
                }
                console.log(`[STDOUT] ${stdout}`);
                snapshot.ref.update({ executado: true, processado_em: new Date().toISOString() });
            });
        }
    });
} catch (e) {
    console.error("Erro Firebase:", e.message);
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEXUS] Servidor ativo em http://localhost:${PORT}`);
});
