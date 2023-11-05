#!/usr/bin/env bash

rm -f backend/instance/itu_data.db

source backend/venv/bin/activate
python3 backend/init_db.py
deactivate
