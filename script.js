import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Configuração Nexus-e6ef2
const firebaseConfig = {
  apiKey: "AIzaSyD_hwtIHSKdcoNMAYLxIUI80TCzfJItHpY",
  authDomain: "nexus-e6ef2.firebaseapp.com",
  databaseURL: "https://nexus-e6ef2-default-rtdb.firebaseio.com",
  projectId: "nexus-e6ef2",
  storageBucket: "nexus-e6ef2.firebasestorage.app",
  messagingSenderId: "772343160595",
  appId: "1:772343160595:web:06113b8858b39be1f5c4e6"
};

// Inicialização
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const logArea = document.getElementById('console');

// Função auxiliar para logs no Dashboard
function addLog(msg) {
    const div = document.createElement('div');
    div.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logArea.prepend(div);
    if(logArea.childNodes.length > 30) logArea.removeChild(logArea.lastChild);
}

// --- COMANDOS (ESCRITA NO FIREBASE) ---

// 1. Comando de Voz
document.getElementById('send-voice').onclick = () => {
    const text = document.getElementById('voice-input').value;
    if(text) {
        set(ref(db, 'commands/speech'), {
            message: text,
            timestamp: Date.now()
        });
        document.getElementById('voice-input').value = "";
        addLog(`Voz enviada: "${text}"`);
    }
};

// 2. Comando da Lanterna (Ligar)
document.getElementById('torch-on').onclick = () => {
    set(ref(db, 'commands/torch'), {
        active: true,
        timestamp: Date.now()
    });
    addLog("Hardware: Solicitado Ligar Lanterna");
};

// 3. Comando da Lanterna (Desligar)
document.getElementById('torch-off').onclick = () => {
    set(ref(db, 'commands/torch'), {
        active: false,
        timestamp: Date.now()
    });
    addLog("Hardware: Solicitado Desligar Lanterna");
};

// --- TELEMETRIA (LEITURA EM TEMPO REAL) ---

// Monitoramento Nó Cloud (Render)
onValue(ref(db, 'telemetry/current'), (snapshot) => {
    const data = snapshot.val();
    if(data) {
        document.getElementById('status-text').innerText = data.status;
        document.getElementById('uptime-text').innerText = Math.floor(data.uptime) + "s";
        document.getElementById('status-text').style.color = "#00ff41";
    }
});

// Monitoramento Nó Mobile (Termux)
onValue(ref(db, 'telemetry/termux_device'), (snapshot) => {
    const data = snapshot.val();
    if(data) {
        document.getElementById('batt-percent').innerText = data.battery + "%";
        const icon = data.battery_status.includes('charging') ? '⚡' : '🔋';
        document.getElementById('batt-icon').innerText = icon;
        addLog(`Telemetria: Celular em ${data.battery}%`);
    }
});
