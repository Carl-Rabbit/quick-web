from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/api/test/counter/', methods=['POST'])
def update_counter():
    params = request.json
    counter = int(params['counter'])

    counter += 1

    resp = {'counter': counter}
    return jsonify(resp), 200, {"Content-Type": "application/json"}


if __name__ == '__main__':
    app.run()
