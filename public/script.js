import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
    databaseURL: "https://nexus-e6ef2-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const logArea = document.getElementById('console');
const statusText = document.getElementById('status-text');
const battText = document.getElementById('batt-percent');

function log(msg, type = 'info') {
    const time = new Date().toLocaleTimeString();
    logArea.innerHTML += `<div>[${time}] ${msg}</div>`;
    logArea.scrollTop = logArea.scrollHeight;
}

// Ouvir Telemetria do Termux
onValue(ref(db, 'telemetry/termux_device'), (snapshot) => {
    const data = snapshot.val();
    if(data) {
        battText.innerText = `${data.battery_level}%`;
        statusText.innerText = "ONLINE";
        statusText.style.color = "#00ff00";
    }
});

// Enviar comandos de IA (Botão Rosa)
document.getElementById('run-ia').addEventListener('click', () => {
    const val = document.getElementById('ia-input').value;
    if(val) {
        push(ref(db, 'nexus/comandos'), { texto: val, executado: false, timestamp: Date.now() });
        log(`IA: Solicitado -> ${val}`);
        document.getElementById('ia-input').value = "";
    }
});

log("NEXUS SRE: Dashboard Conectado.");
