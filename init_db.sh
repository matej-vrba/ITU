#!/usr/bin/env bash

source backend/venv/bin/activate
python3 backend/init_db.py
deactivate