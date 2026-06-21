#!/bin/bash
# Script de automação de entrega Sentinela v1.0
echo "[SENTINELA] Iniciando deploy para Firebase..."
cd ~/sentinela_dev
# Comando de deploy seletivo
firebase deploy --only hosting
echo "[SENTINELA] Deploy concluído com sucesso."
