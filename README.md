# Nastavení prostředí
Pro prvotní nastavení prostředí slouží `setup.sh`, ten potřebuje `npm`, `pip`, `python` a možná další

# Spuštění
Pro spuštění by mělo stačit `npm run dev`, web je pak dostupný na `127.0.0.1:5100`

# DB
db se inicializuje `./init_db.sh`

# db testy
`source backend/venv/bin/activate`
`python3 backend/init_db.py`
`deactivate`
