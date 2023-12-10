from app import create_app, db
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import Blueprint,jsonify,redirect
from flask_cors import CORS, cross_origin
from app.models import Snippet
from sqlalchemy import select,insert,update,delete
from sqlalchemy.orm import Session
from sqlalchemy import bindparam
from datetime import datetime



app = create_app()
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True, debug=True)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

if __name__ == '__main__':
    app.run(debug=True)

def snippetToJsObj(s):
    return {'id': s.id, 'title': s.title, 'created_at': s.created_at.strftime('%d.%m.%Y')}

@socketio.on('open-project')
def open_proj(data):
    if(data['projectId'] is None):
        return
    print("join " + data['projectId'])
    join_room("{}".format(data['projectId']))
    c = db.session.scalars(select(Snippet).where(Snippet.project_id.is_(data['projectId']))).all()
    emit('all-snippets', {'snippets': list(map(snippetToJsObj, c))})


@socketio.on('add-snippet')
def add_snippet(data):
    if(data['projectId'] is None):
        return

    s = db.session.scalar(insert(Snippet).returning(Snippet),
                           [{'title': "New snippet", "created_at": datetime.today(),'project_id': data['projectId']}])
    db.session.commit()
    emit('new-snippet', snippetToJsObj(s), to=data['projectId'])

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

@app.route("/snippets/<snippet_id>", methods=["DELETE"], strict_slashes=False)
@cross_origin()
def deleteSnippet(snippet_id):

    room_id = db.session.scalars(select(Snippet).where(Snippet.id.is_(snippet_id))).first().project_id
    db.session.connection().execute(delete(Snippet).where(Snippet.id == bindparam("s_id")),
                                    [{"s_id": snippet_id}])
    db.session.connection().commit()

    c = db.session.scalars(select(Snippet).where(Snippet.project_id.is_(room_id))).all()
    socketio.emit('all-snippets', {'snippets': list(map(snippetToJsObj, c))}, to="{}".format(room_id))
    return jsonify(message="Snippet deleted")
