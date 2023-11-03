from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/", methods=["GET"], strict_slashes=False)
def hello_world():
    response = jsonify({'data': 'Hello from backend'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/categories", methods=["GET"], strict_slashes=False)
def getCategories():
    categories = ["Auto-moto", "Elektro", "Zvířata", "Oblečení", "Zahrada"]

    response = jsonify(categories)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
