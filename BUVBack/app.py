from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

import calculate_iou

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


@app.route('/api/test/fetchMap/', methods=['POST'])
def fetch_map():
    data_path = '{}/data/line_station.json'.format(FILE_ABS_PATH)
    # 将读取方式改为rb解决读取问题
    with open(data_path, 'rb') as input_file:
        data = json.load(input_file)
        return data


@app.route('/api/test/fetchRoute/', methods=['POST'])
def fetch_route():
    data_path = '{}/data/example_1.json'.format(FILE_ABS_PATH)
    with open(data_path, 'rb') as input_file:
        data = json.load(input_file)
        return data


@app.route('/api/test/fetchAll/', methods=['POST'])
def fetch_all():
    data_path = '{}/data/allRouteInfo.json'.format(FILE_ABS_PATH)
    with open(data_path, 'rb') as input_file:
        data = json.load(input_file)
        return data


@app.route('/api/test/fetchAllData/', methods=['POST'])
def fetch_alldata():
    data_path = '{}/data/data.json'.format(FILE_ABS_PATH)
    with open(data_path, 'r', encoding="gbk") as input_file:
        data = json.load(input_file)
        return data


@app.route('/api/test/calIOU/', methods=['POST'])
def calIOU():
    data = request.get_json(silent=True)
    print(data)
    flag = calculate_iou.calculate_iou(data)
    return flag


if __name__ == '__main__':
    app.run()



