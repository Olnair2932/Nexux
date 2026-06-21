import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_hwtIHSKdcoNMAYLxIUI80TCzfJItHpY",
  authDomain: "nexus-e6ef2.firebaseapp.com",
  databaseURL: "https://nexus-e6ef2-default-rtdb.firebaseio.com",
  projectId: "nexus-e6ef2",
  storageBucket: "nexus-e6ef2.firebasestorage.app",
  messagingSenderId: "772343160595",
  appId: "1:772343160595:web:06113b8858b39be1f5c4e6"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const statusRef = ref(db, 'telemetry/current');

const logArea = document.getElementById('console');

function addLog(message, type = "info") {
    const time = new Date().toLocaleTimeString();
    const color = type === "system" ? "#00ff41" : "#888";
    const entry = document.createElement('div');
    entry.innerHTML = `<span style="color: ${color}">[${time}] ${message}</span>`;
    logArea.prepend(entry);
}

// Mensagem de Boas-Vindas do SRE
window.onload = () => {
    addLog("=== SISTEMA NEXUS ATIVADO ===", "system");
    addLog("OPERADOR IDENTIFICADO: Olnair2932", "system");
    addLog("STATUS: Aguardando telemetria do Render...", "info");
};

onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        document.getElementById('status-text').innerText = data.status;
        document.getElementById('uptime-text').innerText = Math.floor(data.uptime) + "s";
        document.getElementById('load-text').innerText = data.load;
        document.getElementById('load-bar').style.width = (data.load * 100) + "%";
        
        const badge = document.getElementById('status-badge');
        badge.innerText = "LINK ESTABELECIDO";
        badge.style.background = "#00441b";
        
        addLog(`PULSO RECEBIDO: Latência nominal | Carga: ${data.load}`, "info");
    }
});
