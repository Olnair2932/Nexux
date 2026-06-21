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

// Inicialização
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const statusRef = ref(db, 'telemetry/current');

const logArea = document.getElementById('console');

function addLog(message) {
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.innerHTML = `<span style="color: #666">[${time}]</span> ${message}`;
    logArea.prepend(entry);
    if(logArea.childNodes.length > 50) logArea.removeChild(logArea.lastChild);
}

// Escuta em tempo real (Sem Refresh)
onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        document.getElementById('status-text').innerText = data.status;
        document.getElementById('uptime-text').innerText = Math.floor(data.uptime) + "s";
        document.getElementById('load-text').innerText = data.load;
        document.getElementById('load-bar').style.width = (data.load * 100) + "%";
        
        // Update Badge
        const badge = document.getElementById('status-badge');
        badge.innerText = "DATA SYNC ACTIVE";
        badge.style.background = "#00441b";
        
        addLog(`Heartbeat recebido: Load ${data.load} | Uptime ${Math.floor(data.uptime)}s`);
    }
}, (error) => {
    addLog(`ERRO DE CONEXÃO: ${error.message}`);
});
