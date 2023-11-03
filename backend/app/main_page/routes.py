from flask import Blueprint,jsonify
from app import db
from app.models import User,Advertisment,Category

main_page = Blueprint('main_page', __name__)

@main_page.route("/", methods=["GET"], strict_slashes=False)
def hello_world():
    response = jsonify({'data': 'Hello from backend'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@main_page.route("/categories", methods=["GET"], strict_slashes=False)
def getCategories():
    categories = ["Auto-moto", "Elektro", "Zvířata", "Oblečení", "Zahrada"]

    response = jsonify(categories)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response