#!/bin/bash
# ============================================================
# setup-github.sh
# Script para inicializar el repositorio y hacer el primer push
# Uso: bash setup-github.sh TU_USUARIO_GITHUB
# ============================================================

set -e

GITHUB_USER=${1:-"TU_USUARIO"}
REPO_NAME="taskapi"
GITHUB_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   TaskAPI — Setup inicial de GitHub      ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "Usuario: $GITHUB_USER"
echo "Repo:    $GITHUB_URL"
echo ""

# 1. Actualizar sonar-project.properties con el usuario real
sed -i "s/tu-usuario/${GITHUB_USER}/g" sonar-project.properties
sed -i "s/tu-usuario/${GITHUB_USER}/g" README.md

# 2. Inicializar Git
git init
git branch -M main

# 3. Agregar .gitignore (asegurarse de que coverage/ no se suba excepto lcov-report)
cat >> .gitignore << 'EOF'

# Mantener solo el reporte HTML de cobertura
coverage/*
!coverage/lcov-report/
!coverage/lcov-report/**
!coverage/lcov.info
EOF

# 4. Hacer el primer commit
git add .
git commit -m "feat: TaskAPI REST con pipeline CI/CD completo

- Express.js REST API (7 endpoints CRUD)
- 40 tests (20 unitarios + 14 integración)
- TDD aplicado en createTask y updateTask
- Cobertura: 98.91% statements, 94.44% branches
- Pipeline GitHub Actions: install→lint→test→coverage→build→deploy
- ESLint configurado (0 errores)
- SonarCloud integration
- Reporte HTML de cobertura incluido"

# 5. Conectar con GitHub
echo ""
echo "⚠️  Asegúrate de haber creado el repo en GitHub:"
echo "   https://github.com/new  (nombre: taskapi, público)"
echo ""
read -p "¿Repositorio creado en GitHub? (s/n): " confirm
if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
  git remote add origin "$GITHUB_URL"
  git push -u origin main
  echo ""
  echo "✅ Push completado: $GITHUB_URL"
  echo ""
  echo "Próximos pasos:"
  echo "  1. Ve a Actions en GitHub para ver el pipeline correr"
  echo "  2. Configura SONAR_TOKEN en Settings → Secrets"
  echo "  3. (Opcional) Configura RENDER_DEPLOY_HOOK para deploy automático"
else
  echo ""
  echo "Cuando hayas creado el repo, ejecuta:"
  echo "  git remote add origin $GITHUB_URL"
  echo "  git push -u origin main"
fi
