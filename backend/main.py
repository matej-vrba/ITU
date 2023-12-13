from app import create_app, db
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import Blueprint,jsonify,redirect
from flask_cors import CORS, cross_origin
from app.models import Snippet,Message,Vote
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


@socketio.on('get-all-messages')
def handle_get_all_messages(snippet_id):
    # Retrieve all messages for the given snippet_id
    messages = Message.query.filter_by(snippet_id=snippet_id).all()
    messages_data = [{'name': message.name, 'text': message.message, 'snippet_id': message.snippet_id} for message in messages]
    print(messages_data)
    emit('messages', messages_data)

@socketio.on('send-message')
def handle_send_message(data):
    name = data['name']
    text = data['text']
    snippet_id = data['snippetId']

    # Save the message to the database
    new_message = Message(name=name, message=text, snippet_id=snippet_id)
    db.session.add(new_message)
    db.session.commit()

    # Fetch and broadcast all messages after inserting a new message
    handle_get_all_messages(snippet_id)
 
@socketio.on('start-vote')
def handle_new_vote(data):
    vote_title = data['vote_title']
    snippet_id = data['snippetId']
    
    new_vote = Vote(vote_title=vote_title, snippet_id=snippet_id, active=True)
    db.session.add(new_vote)
    db.session.commit()
    
    handle_get_all_votes(snippet_id)
       
@socketio.on('get-all-votes')
def handle_get_all_votes(data):
    votes = Vote.query.filter_by(snippet_id=data).all()
    #user = User.query.filer_by(id=data['userId']).all()
    votes_data = [{'vote_title': vote.vote_title,'snippet_id': vote.snippet_id} for vote in votes]
    print(votes_data)
    emit('votes', votes_data)
    
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

    #original correct
    projet = Project(created_at=datetime.today(),creator=user_id,connection_string=random_string)

    # #just for testing
    # ## START ###################################################3
    # projet = Project(created_at=datetime.today(),creator=user_id,connection_string=random_string)
    # db.session.add(projet)
    # db.session.commit()

    # snip = Snippet(title="Test snip", created_at=datetime.today(), code="""//sample code
    #     #include <stdio.h>

    #     int main(int argc, char *argv[]) {
    #         printf("Hello world\\n")
    #         return 0;
    #     }""",project_id = projet.id)
    # db.session.add(snip)
    # db.session.commit()
    # projet.children.append(snip)
    # ## END OF TEST ###################################################3
    
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
    [projects_json.append({"id" : project.id,
                           "name" : "todo",
                           "created" : project.created_at,
                           "role" : "creator",
                           "code":project.children[0].code if project.children != [] else "empty",}
                           ) for project in owned_projects]
    [projects_json.append({"id" : project.id,
                        "name" : "todo",
                        "created" : project.created_at,
                        "role" : "collab",
                        "code":project.children[0].code if project.children != [] else "empty",}
                        ) for project in collab_projects]

    return jsonify(projects_json)


@app.route("/project/<project_id>", methods=["DELETE"], strict_slashes=False)
@cross_origin()
def delete_projects(project_id):
    project = Project.query.filter_by(id=project_id).first()
    db.session.delete(project)
    db.session.commit()
    return jsonify(message="Project deleted")