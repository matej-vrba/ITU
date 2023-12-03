from app import create_app
from flask_socketio import SocketIO, emit
from flask import Blueprint,jsonify

app = create_app()
socketio = SocketIO(app, cors_allowed_origins="*")

if __name__ == '__main__':
    app.run(debug=True)

i = 4;

def fakeData(i):
    return {'id': i, 'title': chr(ord('a') + i)}

@socketio.on('connect')
def connect_list_snippets():
    global i
    emit('all-snippets', {'snippets': list(map(fakeData, range(0,i)))})


@socketio.on('add-snippet')
def connect_list_snippets():
    global i
    i += 1
    emit('new-snippet', {'id': i, 'title': 'A new snippet'}, broadcast=True)

@socketio.on('get-snippet-title')
def get_title(snippet_id):
    emit('set-snippet-title', fakeData(snippet_id))

@socketio.on('update-snippet-title')
def upodate_title(snippet_id, title):
    emit('set-snippet-title', {'id': snippet_id, 'title': title}, broadcast=True)
