from flask import Blueprint,jsonify,request,make_response
from app import db
from app.models import User,Snippet
from sqlalchemy import select

main_page = Blueprint('main_page', __name__)

@main_page.route("/", methods=["GET"], strict_slashes=False)
def hello_world():
    response = jsonify({'data': 'Hello from backend'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


def snippetToJsObj(s):
    return {'id': s.id, 'title': s.title, 'created_at': s.created_at.strftime('%d.%m.%Y'), "code": s.code, "lang": s.lang}

@main_page.route("/snippets/<snippet_id>", methods=["GET"], strict_slashes=False)
def getSnippets(snippet_id):
    s = db.session.scalars(select(Snippet).where(Snippet.id.is_(snippet_id))).first()
    if(s is None):
        return ""
    response = jsonify(snippetToJsObj(s))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
