from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
FILE_ABS_PATH = os.path.dirname(__file__)

app = Flask(__name__)
CORS(app)


@app.route('/api/test/counter/', methods=['POST'])
def update_counter():
    params = request.json
    counter = int(params['counter'])

    counter += 1

    resp = {'counter': counter}
    return jsonify(resp), 200, {"Content-Type": "application/json"}


@app.route('/api/test/hello/', methods=['POST'])
def hello_resp():
    params = request.json
    msg = int(params['msg'])
    print(msg)
    return "hello VUE"


@app.route('/api/test/fetchData/', methods=['POST'])
def fetch_data():
    data_path = '{}/data/miserables.json'.format(FILE_ABS_PATH)
    with open(data_path, 'r') as input_file:
        data = json.load(input_file)
        return data

if __name__ == '__main__':
    app.run()
