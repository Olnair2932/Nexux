#!/bin/bash

# --- CONFIGURAÇÃO ---
REPO_URL="https://github.com/Olnair2932/Nexux"
DIR="/data/data/com.termux/files/home/sentinela_dev"

cd "$DIR" || exit

# 1. Inicializa o Git se não houver
if [ ! -d ".git" ]; then
    echo "📦 Inicializando Git..."
    git init
    git remote add origin "$REPO_URL"
    git branch -M main
else
    echo "✅ Git já inicializado."
    # Garante que o remote está correto
    git remote set-url origin "$REPO_URL"
fi

# 2. Criar .gitignore para segurança (Não enviar chaves privadas)
cat << 'GIGNORE' > .gitignore
node_modules/
.env
service-account.json
*.log
GIGNORE

# 3. Adicionar arquivos e realizar Commit
echo "📝 Adicionando arquivos..."
git add .
git commit -m "Nexus SRE Engine: Dashboard, IA Integration and Arsenal [Termux Push]"

# 4. Enviar para o GitHub
echo "🚀 Enviando para o GitHub..."
# O Git solicitará seu Username e o Token (como senha)
git push -u origin main --force

echo "✨ Sincronização concluída com o repositório Nexux!"
