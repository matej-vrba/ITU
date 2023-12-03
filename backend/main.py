from app import create_app, db
from flask_socketio import SocketIO, emit
from flask import Blueprint,jsonify
from app.models import Snippet
from sqlalchemy import select,insert,update
from sqlalchemy.orm import Session
from sqlalchemy import bindparam
from datetime import datetime



app = create_app()
socketio = SocketIO(app, cors_allowed_origins="*")

if __name__ == '__main__':
    app.run(debug=True)

def snippetToJsObj(s):
    return {'id': s.id, 'title': s.title, 'created_at': s.created_at.strftime('%d.%m.%Y')}

@socketio.on('connect')
def connect_list_snippets():
    all_snippets = select(Snippet)
    b = db.session.scalars(all_snippets)
    c = b.all()

    emit('all-snippets', {'snippets': list(map(snippetToJsObj, c))})


@socketio.on('add-snippet')
def connect_list_snippets():
    s = db.session.scalar(insert(Snippet).returning(Snippet),
                           [{'title': "New snippet", "created_at": datetime.today()}])
    db.session.commit()
    emit('new-snippet', snippetToJsObj(s), broadcast=True)

@socketio.on('update-snippet-title')
def upodate_title(snippet_id, title):
    db.session.connection().execute(update(Snippet).where(Snippet.id == bindparam("s_id")),
                                    [{"s_id": snippet_id, "title": title}])
    db.session.connection().commit()
    #db.session.flush()
    #db.session.commit()

    s = db.session.scalars(select(Snippet).where(Snippet.id.is_(snippet_id))).first()
    #db.session.commit()

    emit('set-snippet-title', snippetToJsObj(s), broadcast=True)
