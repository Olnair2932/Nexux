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

// GATILHO DE ARSENAL
document.getElementById('run-script').onclick = () => {
    const scriptName = document.getElementById('script-input').value;
    if(scriptName) {
        set(ref(db, 'commands/arsenal'), {
            script: scriptName,
            timestamp: Date.now()
        });
        document.getElementById('script-input').value = "";
        const entry = document.createElement('div');
        entry.innerHTML = `[${new Date().toLocaleTimeString()}] Solicitado script: ${scriptName}`;
        document.getElementById('console').prepend(entry);
    }
};

// ... (Manter os outros ouvintes de Lanterna e Telemetria conforme scripts anteriores)
// Simplificando para o exemplo:
onValue(ref(db, 'telemetry/termux_device'), (snap) => {
    if(snap.val()) document.getElementById('batt-percent').innerText = snap.val().battery + "%";
});
document.getElementById('torch-on').onclick = () => set(ref(db, 'commands/torch'), { active: true, timestamp: Date.now() });
document.getElementById('torch-off').onclick = () => set(ref(db, 'commands/torch'), { active: false, timestamp: Date.now() });
