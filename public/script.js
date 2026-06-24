import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
    databaseURL: "https://nexus-e6ef2-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const statusText = document.getElementById('status-text');
const battText = document.getElementById('batt-percent');
const logArea = document.getElementById('console');

function log(msg) {
    const time = new Date().toLocaleTimeString();
    logArea.innerHTML += `<div>[${time}] ${msg}</div>`;
    logArea.scrollTop = logArea.scrollHeight;
}

// OUVINTE DE TELEMETRIA (Onde corrigimos o battery_level)
onValue(ref(db, 'telemetry/termux_device'), (snapshot) => {
    const data = snapshot.val();
    if (data && data.battery_level !== undefined) {
        battText.innerText = `${data.battery_level}%`;
        statusText.innerText = data.status || "ONLINE";
        statusText.style.color = "#00ff00";
    } else {
        battText.innerText = "--%";
        statusText.innerText = "OFFLINE";
    }
});

// BOTÃO DA IA
document.getElementById('run-ia').addEventListener('click', () => {
    const texto = document.getElementById('ia-input').value;
    if(texto) {
        push(ref(db, 'nexus/comandos'), { texto: texto, executado: false, timestamp: Date.now() });
        log(`IA: Enviado -> ${texto}`);
        document.getElementById('ia-input').value = "";
    }
});

log("Dashboard SRE conectado ao Firebase.");
