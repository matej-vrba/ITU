from flask import Blueprint,jsonify
from app import db
from app.models import User,Advertisment,Category
from sqlalchemy import select
from app.models import Snippet

main_page = Blueprint('main_page', __name__)

@main_page.route("/", methods=["GET"], strict_slashes=False)
def hello_world():
    response = jsonify({'data': 'Hello from backend'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@main_page.route("/categories", methods=["GET"], strict_slashes=False)
def getCategories():
    categories = ["Auto-moto", "Elektro", "Zvířata", "Oblečení", "Zahrada"]
    categories = categories + categories + categories + categories

    response = jsonify(categories[:18])
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@main_page.route("/products", methods=["GET"], strict_slashes=False)
def getProducts():
    products = Advertisment.query.all()
    serialized_products = [product.serialize() for product in products]
    response = jsonify(serialized_products)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


def snippetToJsObj(s):
    return {'id': s.id, 'title': s.title, 'created_at': s.created_at.strftime('%d.%m.%Y'), "code": s.code}

@main_page.route("/snippets/<snippet_id>", methods=["GET"], strict_slashes=False)
def getSnippets(snippet_id):
    s = db.session.scalars(select(Snippet).where(Snippet.id.is_(snippet_id))).first()
    response = jsonify(snippetToJsObj(s))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
