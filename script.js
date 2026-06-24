import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// SUAS CONFIGURAÇÕES DO FIREBASE (Coloque aqui seus dados reais)
const firebaseConfig = {
    databaseURL: "SUA_URL_DO_FIREBASE"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const logArea = document.getElementById('console');
function log(msg) {
    const time = new Date().toLocaleTimeString();
    logArea.innerHTML += `<div>[${time}] ${msg}</div>`;
    logArea.scrollTop = logArea.scrollHeight;
}

// --- COMANDO IA NEXUS (ROSA) ---
document.getElementById('run-ia').addEventListener('click', () => {
    const texto = document.getElementById('ia-input').value;
    if(texto) {
        push(ref(db, 'nexus/comandos'), {
            texto: texto,
            executado: false,
            timestamp: Date.now()
        });
        log(`IA: Enviando solicitação de catálogo: ${texto}`);
        document.getElementById('ia-input').value = "";
    }
});

// --- COMANDO ARSENAL (AZUL) ---
document.getElementById('run-script').addEventListener('click', () => {
    const script = document.getElementById('script-input').value;
    if(script) {
        push(ref(db, 'nexus/scripts'), {
            arquivo: script,
            executado: false
        });
        log(`ARSENAL: Executando script shell: ${script}`);
        document.getElementById('script-input').value = "";
    }
});

// --- LANTERNA ---
document.getElementById('torch-on').addEventListener('click', () => {
    set(ref(db, 'comandos/lanterna'), { status: "on" });
    log("HARDWARE: Comando lanterna ON enviado.");
});

document.getElementById('torch-off').addEventListener('click', () => {
    set(ref(db, 'comandos/lanterna'), { status: "off" });
    log("HARDWARE: Comando lanterna OFF enviado.");
});

// OUVIR TELEMETRIA
onValue(ref(db, 'telemetry/termux_device'), (snapshot) => {
    const data = snapshot.val();
    if(data) {
        document.getElementById('batt-percent').innerText = `${data.battery_level}%`;
        log(`SINCRO: Telemetria atualizada (${data.battery_level}%)`);
    }
});
