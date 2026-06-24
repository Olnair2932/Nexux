// --- CONFIGURAÇÃO DO DASHBOARD NEXUS SRE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// 1. Configurações do Firebase (Substitua pela sua URL real)
const firebaseConfig = {
    databaseURL: "https://nexux-sre-default-rtdb.firebaseio.com/" // COLOQUE SUA URL AQUI
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- SELETORES DE INTERFACE ---
const logArea = document.getElementById('console');
const iaInput = document.getElementById('ia-input');
const scriptInput = document.getElementById('script-input');
const battText = document.getElementById('batt-percent');
const statusText = document.getElementById('status-text');

// Função de Logs no Console do Dashboard
function log(msg, type = 'info') {
    const time = new Date().toLocaleTimeString();
    const color = type === 'error' ? '#ff4444' : type === 'success' ? '#00ff00' : '#0088ff';
    logArea.innerHTML += `<div><span style="color: #888">[${time}]</span> <span style="color: ${color}">${msg}</span></div>`;
    logArea.scrollTop = logArea.scrollHeight;
}

// 2. MÓDULO ROSA: NEXUS IA (ATUALIZAR SITE)
document.getElementById('run-ia').addEventListener('click', () => {
    const texto = iaInput.value.trim();
    if (texto) {
        log(`IA: Solicitando atualização: "${texto}"`, 'success');
        push(ref(db, 'nexus/comandos'), {
            texto: texto,
            executado: false,
            timestamp: Date.now()
        });
        iaInput.value = "";
    } else {
        log("IA: Digite um comando primeiro.", 'error');
    }
});

// 3. MÓDULO AZUL: ARSENAL (EXECUTAR SCRIPTS NO TERMUX)
document.getElementById('run-script').addEventListener('click', () => {
    const script = scriptInput.value.trim();
    if (script) {
        log(`ARSENAL: Disparando script: ${script}`, 'info');
        push(ref(db, 'nexus/scripts'), {
            arquivo: script,
            executado: false,
            timestamp: Date.now()
        });
        scriptInput.value = "";
    } else {
        log("ARSENAL: Nome do script vazio.", 'error');
    }
});

// 4. MÓDULO LANTERNA (HARDWARE)
document.getElementById('torch-on').addEventListener('click', () => {
    set(ref(db, 'comandos/lanterna'), { status: "on", timestamp: Date.now() });
    log("HARDWARE: Lanterna ON", 'success');
});

document.getElementById('torch-off').addEventListener('click', () => {
    set(ref(db, 'comandos/lanterna'), { status: "off", timestamp: Date.now() });
    log("HARDWARE: Lanterna OFF");
});

// 5. OUVINTE DE TELEMETRIA (TERMUX -> DASHBOARD)
onValue(ref(db, 'telemetry/termux_device'), (snapshot) => {
    const data = snapshot.val();
    if (data) {
        battText.innerText = `${data.battery_level}%`;
        statusText.innerText = "ONLINE";
        statusText.style.color = "#00ff00";
        
        // Alerta de bateria fraca
        if(data.battery_level < 20) {
            log(`⚠️ BATERIA FRACA NO TERMUX: ${data.battery_level}%`, 'error');
        }
    } else {
        statusText.innerText = "OFFLINE";
        statusText.style.color = "#ff4444";
    }
});

log("SISTEMA: Nexus SRE Engine operacional.");
