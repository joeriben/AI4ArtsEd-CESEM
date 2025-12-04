#!/usr/bin/env bash

# Definition von Projektverzeichnis und Server-Skript
PROJECT_DIR="."
SERVER_SCRIPT="server/server.py"
PORT=5000

# Ins Projektverzeichnis wechseln
cd "${PROJECT_DIR}" || {
  echo "Fehler: Konnte Verzeichnis ${PROJECT_DIR} nicht betreten."
  exit 1
}


# Virtuelle Umgebung aktivieren, falls vorhanden
if [ -f "venv/bin/activate" ]; then
  echo "Aktiviere virtuelle Umgebung..."
  source venv/bin/activate
fi

# Python-Pfad setzen und Waitress-Server starten
export PYTHONPATH="${PROJECT_DIR}/server:${PYTHONPATH}"
echo "Starte Waitress-Webserver auf Port ${PORT}: ${SERVER_SCRIPT} …"
python3 "${SERVER_SCRIPT}"

# Wenn der Prozess durch STRG+C oder SIGINT/SIGTERM beendet wird, endet das Skript automatisch.
