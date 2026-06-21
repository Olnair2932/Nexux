import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// FUNÇÃO DE TRANSMISSÃO DE VOZ
document.getElementById('send-voice').onclick = () => {
    const text = document.getElementById('voice-input').value;
    if(text) {
        set(ref(db, 'commands/speech'), {
            message: text,
            timestamp: Date.now()
        });
        document.getElementById('voice-input').value = "";
        alert("Comando de voz enviado para o Termux!");
    }
};

onValue(ref(db, 'telemetry/current'), (snapshot) => {
    const data = snapshot.val();
    if(data) {
        document.getElementById('status-text').innerText = data.status;
        document.getElementById('uptime-text').innerText = Math.floor(data.uptime) + "s";
    }
});

onValue(ref(db, 'telemetry/termux_device'), (snapshot) => {
    const data = snapshot.val();
    if(data) {
        document.getElementById('batt-percent').innerText = data.battery + "%";
        document.getElementById('batt-status').innerText = "Status: " + data.battery_status;
        const icon = data.battery_status.includes('charging') ? '⚡' : '🔋';
        document.getElementById('batt-icon').innerText = icon;
    }
});
