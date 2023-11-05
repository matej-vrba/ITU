# Nastavení prostředí
Pro prvotní nastavení prostředí slouží `setup.sh`, ten potřebuje `npm`, `pip`, `python` a možná další

# DB
db s testovymi daty se inicializuje `./init_db.sh`

# Spuštění
Pro spuštění by mělo stačit `npm run dev`, web je pak dostupný na `127.0.0.1:5100`



# db testy
`source backend/venv/bin/activate`
`python3 backend/init_db.py`
`deactivate`
