from app import create_app
from flask_socketio import SocketIO, emit
from flask import Blueprint,jsonify

app = create_app()
socketio = SocketIO(app, cors_allowed_origins="*")

if __name__ == '__main__':
    app.run(debug=True)

i = 4;

@socketio.on('connect')
def connect_list_snippets():
    global i
    emit('all-snippets', {'snippets': list(range(1,i+1))})


@socketio.on('add-snippet')
def connect_list_snippets():
    global i
    i += 1
    emit('new-snippet', {'snippet': i}, broadcast=True)
