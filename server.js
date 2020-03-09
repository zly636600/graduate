
var express = require('express');
var app = express();
var clustering = require('density-clustering');
var bodyParser = require('body-parser');

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  
    if (req.method == 'OPTIONS') {
      res.send(200); /让options请求快速返回/
    }
    else {
      next();
    }
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/cluster', function(req, res) {

    points = req.body['points']

    console.log(points.length)

    let dbscan = new clustering.DBSCAN();

    let cluster_result = dbscan.run(points, 10, 3)

    console.log(cluster_result.length)

    res.send(cluster_result)

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});