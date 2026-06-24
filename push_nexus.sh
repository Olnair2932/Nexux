#!/bin/bash

# --- CONFIGURAÇÃO ---
REPO_URL="https://github.com/Olnair2932/Nexux"
DIR="/data/data/com.termux/files/home/sentinela_dev"

cd "$DIR" || { echo "❌ Pasta não encontrada"; exit 1; }

# 1. Garantir que o package.json existe (Necessário para o Render)
if [ ! -f "package.json" ]; then
    echo "📦 Criando package.json básico para o Render..."
    npm init -y
    sed -i 's/"test": ".*"/"start": "node server.js"/' package.json
fi

# 2. Configurar .gitignore (Segurança total)
cat << 'GIGNORE' > .gitignore
node_modules/
.env
service-account.json
*.log
push_nexus.sh
GIGNORE

# 3. Preparar Git
if [ ! -d ".git" ]; then
    git init
    git remote add origin "$REPO_URL"
    git branch -M main
else
    git remote set-url origin "$REPO_URL"
fi

# 4. Commit e Push
echo "📝 Comitando alterações..."
git add .
git commit -m "Update SRE Engine: Dashboard Sync & Render Config [$(date +'%Y-%m-%d %H:%M')]"

echo "🚀 Subindo para o GitHub..."
# Note: Pode pedir seu Username e Token novamente
git push -u origin main --force

echo "✨ Sincronização Concluída!"
