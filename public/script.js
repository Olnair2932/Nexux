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
const logArea = document.getElementById('console');

function addLog(msg) {
    const div = document.createElement('div');
    div.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logArea.prepend(div);
}

// ESCUTA NÓ CLOUD (RENDER)
onValue(ref(db, 'telemetry/current'), (snapshot) => {
    const data = snapshot.val();
    if(data) {
        document.getElementById('status-text').innerText = data.status;
        document.getElementById('uptime-text').innerText = Math.floor(data.uptime) + "s";
        document.getElementById('load-text').innerText = data.load;
        document.getElementById('load-bar').style.width = (data.load * 100) + "%";
        addLog("Nuvem: Pulso recebido");
    }
});

// ESCUTA NÓ MOBILE (TERMUX)
onValue(ref(db, 'telemetry/termux_device'), (snapshot) => {
    const data = snapshot.val();
    if(data) {
        document.getElementById('batt-percent').innerText = data.battery + "%";
        document.getElementById('batt-status').innerText = "Status: " + data.battery_status;
        document.getElementById('ram-text').innerText = data.free_ram;
        
        // Ícone dinâmico
        const icon = data.battery_status.includes('charging') ? '⚡' : '🔋';
        document.getElementById('batt-icon').innerText = icon;
        
        // RAM Bar (Baseada em 4GB - Ajustável)
        const ramPercent = Math.min(100, (data.free_ram / 4000) * 100);
        document.getElementById('ram-bar').style.width = ramPercent + "%";
        
        addLog(`Mobile: Bateria em ${data.battery}% | RAM: ${data.free_ram}MB`);
    }
});
