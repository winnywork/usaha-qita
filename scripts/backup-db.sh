#!/bin/bash
# ==============================================================================
# Script Cadangan Basis Data Otomatis UsahaQita (MySQL Dump)
# Dapat dijadwalkan di cron: 0 2 * * * /opt/usaha-qita/scripts/backup-db.sh
# ==============================================================================
set -e

BACKUP_DIR="/opt/usaha-qita/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/usahaqita_db_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "💾 Memulai proses pencadangan basis data usaha_qita..."
docker compose exec -T db mysqldump -u root -pusahaqita_root_secret --single-transaction --quick usaha_qita | gzip > "$BACKUP_FILE"

echo "✅ Cadangan berhasil disimpan di: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"

# Hapus cadangan yang lebih lama dari 14 hari
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +14 -delete
echo "🧹 Cadangan lawas (> 14 hari) telah dibersihkan."
