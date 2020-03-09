from flask import Flask, request
from sklearn.cluster import DBSCAN
import numpy as np
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
@cross_origin()
def hello_world():
    return 'hello world'


@app.route('/cluster', methods=['POST'])
def cluster():
    #print(request.json)
    content = request.get_json(silent=True)

    points = content

    X = np.array(points)
    db = DBSCAN(eps=10, min_samples=3).fit(X)

    cluster_labels = db.labels_

    buckets = dict()

    for index in range(len(points)):
        cluster = cluster_labels[index]
        if cluster in buckets:
            buckets[cluster].append(index)
        else:
            buckets[cluster] = []
            buckets[cluster].append(index)

    result = []

    for cluster in buckets:
        sub = []
        for index in range(len(buckets[cluster])):
            sub.append(buckets[cluster][index])
        result.append(sub)

    #print(result)

    return json.dumps(result)

if __name__ == '__main__':
    app.run(port=3000, debug=True)


