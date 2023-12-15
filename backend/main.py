from app import create_app, db
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import Blueprint,jsonify,redirect, request
from flask_cors import CORS, cross_origin
from app.models import Snippet,Message,Vote, Vote_result
from sqlalchemy import select,insert,update,delete, and_
from sqlalchemy.orm import Session
from sqlalchemy import bindparam
from sqlalchemy import func
from datetime import datetime
from app.models import User,Project,project_user
import asyncio
import secrets
import string

app = create_app()
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True, debug=True)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

if __name__ == '__main__':
    app.run(debug=True)

def snippetToJsObj(s):
    return {'id': s.id, 'title': s.title, 'created_at': s.created_at.strftime('%d.%m.%Y'), "code": s.code}

def messageToJsObj(s):
    return {'name': s.name, 'message': s.message}

def voteToJsObj(s):
    return {'id': s.id, 'vote_title': s.vote_title, 'code_line': s.code_line, 'active': s.active}

def resultToJsObj(s):
    return {'id': s.id, 'vote_id': s.vote_id, 'user_id': s.user_id, 'vote_state': s.vote_state}



@socketio.on('open-project')
def open_proj(data):
    print(data);
    if(data['projectId'] is None):
        return
    print("join " + str(data['projectId']))
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
@app.route("/snippet/<snippet_id>/set-title/", methods=["POST"], strict_slashes=False)
def upodate_title(snippet_id):
    db.session.connection().execute(update(Snippet).where(Snippet.id == bindparam("s_id")),
                                    [{"s_id": snippet_id, "title": request.json['value']}])
    db.session.connection().commit()
    #db.session.flush()
    #db.session.commit()

    s = db.session.scalars(select(Snippet).where(Snippet.id.is_(snippet_id))).first()
    #db.session.commit()

    room_id = db.session.scalars(select(Snippet).where(Snippet.id.is_(snippet_id))).first().project_id

    socketio.emit('snippet-title-changed', {"value": request.json['value']});
    #socketio.emit('set-snippet-title', snippetToJsObj(s), broadcast=True)
    socketio.emit('set-snippet-title', snippetToJsObj(s), to="{}".format(room_id))

    return jsonify(value=request.json['value'])

@app.route("/snippets/<snippet_id>", methods=["DELETE"], strict_slashes=False)
@cross_origin()
def deleteSnippet(snippet_id):

    room_id = db.session.scalars(select(Snippet).where(Snippet.id.is_(snippet_id))).first().project_id
    db.session.connection().execute(delete(Snippet).where(Snippet.id == bindparam("s_id")),
                                    [{"s_id": snippet_id}])
    db.session.connection().commit()

    c = db.session.scalars(select(Snippet).where(Snippet.project_id.is_(room_id))).all()
    socketio.emit('snippet-deleted', {'id': snippet_id}, to="{}".format(room_id))
    socketio.emit('all-snippets', {'snippets': list(map(snippetToJsObj, c))}, to="{}".format(room_id))
    return jsonify(message="Snippet deleted")

@app.route("/get-all-messages/<snippet_id>", methods=["GET"], strict_slashes=False)
def handle_get_all_messages(snippet_id):
    # Retrieve all messages for the given snippet_id
    print(snippet_id);
    messages = Message.query.filter_by(snippet_id=snippet_id).all()
    messages_data = [messageToJsObj(message) for message in messages]
    return jsonify(messages_data)

@socketio.on('send-message')
def handle_send_message(data):
    name = data['name']
    text = data['text']
    snippet_id = data['snippetId']

    # Save the message to the database
    s = db.session.scalar(insert(Message).returning(Message),
                           [{'name': name, "message": text,'snippet_id': snippet_id}])
    db.session.commit()
    
    # Fetch and broadcast all messages after inserting a new message
    emit('messages', [messageToJsObj(s)] , broadcast=True)
    return messageToJsObj(s)
    
@socketio.on('add-comment')
def handle_add_comment(data):
    vote_title = data['content']
    snippet_id = data['snippetId']
    code_line = data['line']
    user_id = data['user_id']
    
    s = db.session.scalar(insert(Vote).returning(Vote),
                          [{'vote_title': vote_title, 'created_by': user_id, 'code_line': code_line, 'snippet_id': snippet_id, 'active': True}])
    db.session.commit()
    
    emit('votes', [voteToJsObj(s)] , broadcast=True)
    return voteToJsObj(s)
    
@socketio.on('start-vote')    
def handle_new_vote(data):
    vote_title = data['vote_title']
    snippet_id = data['snippetId']
    user_id = data['user_id']
    
    s = db.session.scalar(insert(Vote).returning(Vote),
                        [{'vote_title': vote_title, 'created_by': user_id, 'snippet_id': snippet_id, 'active': True}])
    db.session.commit()

    emit('votes', [voteToJsObj(s)] , broadcast=True)
    return voteToJsObj(s)

@socketio.on('accept-vote')
def handle_accept_vote(data):
    vote_id = data['vote_id']
    user_id = data['user_id']
    vote_state = data['status']
    
    existing_vote_count = db.session.query(func.count(Vote_result.id)) \
    .filter_by(vote_id=vote_id, user_id=user_id).scalar()

    if( existing_vote_count == 0 ):
        s = db.session.scalar(insert(Vote_result).returning(Vote_result),
                          [{'vote_id': vote_id, 'user_id': user_id, 'vote_state': vote_state}])
        
        db.session.commit()
    else:
        db.session.connection().execute(
            update(Vote_result)
            .where(and_(Vote_result.user_id == user_id, Vote_result.vote_id == vote_id))
            .values(vote_state=vote_state)
        )
        s = db.session.scalar(select(Vote_result).where(Vote_result.user_id == user_id and Vote_result.vote_id == vote_id))
        db.session.commit()

    
    emit('voteRes', [resultToJsObj(s)], broadcast=True)

@app.route("/get-all-results/<vote_id>", methods=["GET"], strict_slashes=False)
def handle_get_all_results(vote_id):
    results = Vote_result.query.filter_by(vote_id=vote_id)
    results_data = [resultToJsObj(result) for result in results]
    return jsonify(results_data)
       
@app.route("/get-all-votes/<snippet_id>", methods=["GET"], strict_slashes=False)
def handle_get_all_votes(snippet_id):
    votes = Vote.query.filter_by(snippet_id=snippet_id).all()
    #user = User.query.filer_by(id=data['userId']).all()
    votes_data = [voteToJsObj(vote) for vote in votes]
    return jsonify(votes_data)
    
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
    projet = Project(created_at=datetime.today(),creator=user_id,connection_string=random_string,name="Untitled project")

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
    return {"project_id":projet.id,"project_hash":random_string}

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
        
    return jsonify(project_id=project.id,project_hash=project.connection_string)


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
                           "hash" : project.connection_string,
                           "role" : "creator",
                           "code":project.children[0].code if project.children != [] else "empty",}
                           ) for project in owned_projects]
    [projects_json.append({"id" : project.id,
                        "name" : "todo",
                        "created" : project.created_at,
                        "hash" : project.connection_string,
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

@app.route("/project/<project_id>", methods=["GET"], strict_slashes=False)
@cross_origin()
def get_project(project_id):
    project = Project.query.filter_by(id=project_id).first()
    return jsonify(name=project.name,id=project.id,created_at=project.created_at,creator=project.creator,connection_string=project.connection_string)

@app.route("/project/<project_id>/name/<project_name>", methods=["POST"], strict_slashes=False)
@cross_origin()
def set_project_name(project_id,project_name):
    project = Project.query.filter_by(id=project_id).first()
    project.name=project_name
    db.session.add(project)
    db.session.commit()
    return "set name: "+ project_name

@app.route("/project/<project_id>/set-title/", methods=["POST"], strict_slashes=False)
def set_project_title(project_id):

    project = Project.query.filter_by(id=project_id).first()
    project.name = request.json['value']
    db.session.add(project)
    db.session.commit()

    socketio.emit('project-title-changed', {'value': request.json['value']}, to="{}".format(project_id))
    return jsonify(value=request.json['value'])

@socketio.on('send-message')
def handle_send_message(data):
    name = data['name']
    text = data['text']
    snippet_id = data['snippetId']

    # Save the message to the database
    s = db.session.scalar(insert(Message).returning(Message),
                           [{'name': name, "message": text,'snippet_id': snippet_id}])
    db.session.commit()

    # Fetch and broadcast all messages after inserting a new message
    emit('messages', [messageToJsObj(s)] , broadcast=True)
    return messageToJsObj(s)


@socketio.on('add-code')
def setCode(data):

    db.session.connection().execute(update(Snippet).where(Snippet.id == bindparam("s_id")),
                                    [{"s_id": data["snippetId"], "code": data["code"]}])
    db.session.connection().commit()

    s = db.session.scalars(select(Snippet).where(Snippet.id.is_(data["snippetId"]))).first()

    room_id = db.session.scalars(select(Snippet).where(Snippet.id.is_(data["snippetId"]))).first().project_id

    #emit('snippet-set-code', snippetToJsObj(s), broadcast=True, to="{}".format(room_id))
    emit('snippet-set-code', snippetToJsObj(s), to="{}".format(room_id))




@app.route("/project/hash/<hash>/", methods=["GET"], strict_slashes=False)
@cross_origin()
def project_id_from_hash(hash):

    project = Project.query.filter_by(connection_string=hash).first()
    return jsonify(id=project.id)

