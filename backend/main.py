from app import create_app, db
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import Blueprint,jsonify,redirect
from flask_cors import CORS, cross_origin
from app.models import Snippet
from sqlalchemy import select,insert,update,delete
from sqlalchemy.orm import Session
from sqlalchemy import bindparam
from datetime import datetime
from app.models import User,Project,project_user
import secrets
import string

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
@app.route("/project/<projectId>/snippet/new", methods=["POST"], strict_slashes=False)
def add_snippet(projectId):
    if(projectId is None):
        return

    s = db.session.scalar(insert(Snippet).returning(Snippet),
                           [{'title': "New snippet", "created_at": datetime.today(),'project_id': projectId}])
    db.session.commit()
    socketio.emit('new-snippet', snippetToJsObj(s), to=projectId)
    return snippetToJsObj(s)

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

@app.route("/create-user", methods=["POST"], strict_slashes=False)
@cross_origin()
def create_user():
    user = User()
    db.session.add(user)
    db.session.commit()
    #after commiting user.id is set to user
    return {"user_id":user.id}



def generate_connection_string(length=16):
    characters = string.ascii_letters + string.digits
    connection_string = ''.join(secrets.choice(characters) for _ in range(length))
    return connection_string

@app.route("/project/create/<user_id>", methods=["POST"], strict_slashes=False)
@cross_origin()
def create_project(user_id):
    random_string = generate_connection_string()
    print(random_string)
    projet = Project(created_at=datetime.today(),creator=user_id,connection_string=random_string)
    db.session.add(projet)
    db.session.commit()
    #after commiting project.id is set to project
    return {"project_id":projet.id}

@app.route("/project/connect/<user_id>/<connection_string>", methods=["POST"], strict_slashes=False)
@cross_origin()
def project_connect(user_id,connection_string):
    #after commiting project.id is set to project
    project = Project.query.filter_by(connection_string=connection_string).first()
    if(project == None):
        return jsonify(project_id=None)

    users = User.query.all()
    for u in users:
        print(u.id)

    user = User.query.filter_by(id=user_id).first()
    #pokud user nepouziva projekt stane se userem projektu, a nebude tam pridavat i creatora
    if(not user in project.users and user.id != project.creator):
        project.users.append(user)
        db.session.add(project)
        db.session.commit()
        
    return jsonify(project_id=project.id)


@app.route("/projects/<user_id>", methods=["GET"], strict_slashes=False)
@cross_origin()
def get_projects(user_id):
    owned_projects = Project.query.filter_by(creator=user_id).all()
    projects = Project.query.all()
    user = User.query.filter_by(id=user_id).first()
    collab_projects = []
    for project in projects:
        if user in project.users:
            collab_projects.append(project)
    
    projects_json = []
    #TODO project name
    [projects_json.append({"id" : project.id,"name" : "todo","created" : project.created_at,"role" : "creator"}) for project in owned_projects]
    [projects_json.append({"id" : project.id,"name" : "todo","created" : project.created_at,"role" : "collaborator"}) for project in collab_projects]

    return jsonify(projects_json)