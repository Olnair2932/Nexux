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
const logArea = document.getElementById('console');

function addLog(msg) {
    if(!logArea) return;
    const div = document.createElement('div');
    div.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logArea.prepend(div);
}

// GATILHOS DE COMANDO
const btnOn = document.getElementById('torch-on');
const btnOff = document.getElementById('torch-off');
const btnVoice = document.getElementById('send-voice');

if(btnOn) btnOn.onclick = () => set(ref(db, 'commands/torch'), { active: true, timestamp: Date.now() });
if(btnOff) btnOff.onclick = () => set(ref(db, 'commands/torch'), { active: false, timestamp: Date.now() });
if(btnVoice) btnVoice.onclick = () => {
    const txt = document.getElementById('voice-input').value;
    if(txt) set(ref(db, 'commands/speech'), { message: txt, timestamp: Date.now() });
};

// ESCUTADORES DE TELEMETRIA
onValue(ref(db, 'telemetry/current'), (snapshot) => {
    const data = snapshot.val();
    if(data) {
        if(document.getElementById('status-text')) document.getElementById('status-text').innerText = data.status;
        if(document.getElementById('uptime-text')) document.getElementById('uptime-text').innerText = Math.floor(data.uptime) + "s";
    }
});

onValue(ref(db, 'telemetry/termux_device'), (snapshot) => {
    const data = snapshot.val();
    if(data) {
        if(document.getElementById('batt-percent')) document.getElementById('batt-percent').innerText = data.battery + "%";
        const icon = data.battery_status && data.battery_status.includes('charging') ? '⚡' : '🔋';
        if(document.getElementById('batt-icon')) document.getElementById('batt-icon').innerText = icon;
        addLog(`Sincronia: Bateria em ${data.battery}%`);
    }
});
