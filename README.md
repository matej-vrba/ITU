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

# Použité knihovny

## NPM
viz. frontend/project.json

- @badrap/bar-of-progress
- @testing-library/jest-dom
- @testing-library/react
- @testing-library/user-event
- react
- react-cookie
- react-dom
- react-router-dom
- react-scripts
- react-select
- react-syntax-highlighter
- reactjs-popup
- sass
- socket.io-client
- web-vitals
- react-flash-message
- foreman

## pip
viz. backend/requirements.txt

- bidict
- blinker
- certifi
- charset-normalizer
- click
- docopt
- Flask
- Flask-Cors
- Flask-SocketIO
- Flask-SQLAlchemy
- greenlet
- h11
- idna
- iniconfig
- itsdangerous
- Jinja2
- MarkupSafe
- packaging
- pluggy
- pytest
- python-engineio
- python-socketio
- requests
- simple-websocket
- SQLAlchemy
- typing_extensions
- urllib3
- Werkzeug
- wsproto
- yarg
- random-username
