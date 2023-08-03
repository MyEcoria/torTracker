#!/bin/bash

# Aller dans le dossier backend
cd backend

# Renommer le fichier general.json.exemple en general.json
mv config/general.json.exemple general.json

# Construction de l'image Docker pour le backend
sudo docker build -t tortracker:backend .

# Revenir au dossier parent
cd ..

# Aller dans le dossier frontend
cd frontend

# Construction de l'image Docker pour le frontend
sudo docker build -t tortracker:frontend .