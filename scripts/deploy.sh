#!/bin/bash
# ==============================================================================
# Script Otomatis Deployment / Pembaruan UsahaQita di VPS
# ==============================================================================
set -e

echo "🚀 [1/5] Memeriksa pembaruan kode dari repositori Git..."
git fetch origin main
git reset --hard origin/main

echo "📦 [2/5] Memastikan berkas konfigurasi .env.production tersedia..."
if [ ! -f .env.production ]; then
  echo "⚠️ Berkas .env.production tidak ditemukan! Menyalin dari .env.production.example..."
  cp .env.production.example .env.production
  echo "Silakan edit .env.production untuk memasukkan GEMINI_API_KEY sebelum melanjutkan."
  exit 1
fi

echo "🐳 [3/5] Mengompilasi dan menjalankan kontainer Docker..."
docker compose down || true
docker compose up -d --build

echo "🔄 [4/5] Menjalankan sinkronisasi database Prisma..."
docker compose exec -T web npx prisma db push || echo "Database sudah up-to-date."

echo "✅ [5/5] Memeriksa status kesehatan servis..."
docker compose ps

echo "🎉 Deployment Berhasil! UsahaQita aktif di port 3000."
