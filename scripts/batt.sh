#!/bin/bash
# Script de Telemetria Nexus v2
DB_URL="https://nexus-e6ef2-default-rtdb.firebaseio.com/telemetry/termux_device.json"

echo "🔋 Iniciando monitoramento de bateria..."

while true; do
    # Captura a porcentagem (apenas o número)
    BATT=$(termux-battery-status | jq -r '.percentage')
    
    # Valida se BATT é um número antes de enviar
    if [[ "$BATT" =~ ^[0-9]+$ ]]; then
        # Usa PUT para limpar qualquer erro anterior e definir o objeto novo
        curl -s -X PUT "$DB_URL" \
        -d "{\"battery_level\": $BATT, \"timestamp\": $(date +%s), \"status\": \"ONLINE\"}"
        echo "[$(date +%T)] Bateria enviada: $BATT%"
    else
        echo "⚠️ Erro ao capturar bateria. Verifique o Termux:API"
    fi
    sleep 60
done
