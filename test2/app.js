// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
var express = require('express');  //引入express模块
var mysql = require('mysql')
var app = express();  //创建express的实例
var bodyParser = require('body-parser')

var connection = mysql.createConnection({
  host:'127.0.0.1',
  port:'3306',
  user:'root',
  password:'zly636600',
  database:'sss'
});
connection.connect();
 

app.use(bodyParser.urlencoded({ extended: false }))
//app.use(app.router);


app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});


app.post("/re",function(req,res){

  var lat_number = req.body.lat;
  var lon_number = req.body.lon; 
  console.log(lat_number)
  var sql = '';
  sql = 'SELECT DAYOFWEEK(begin_date) as week,HOUR(begin_date) as hour FROM unicom_record,my2g3g WHERE my2g3g.lat = '+lat_number+' and my2g3g.lon = '+lon_number+' and my2g3g.lac = unicom_record.lac and my2g3g.ci = unicom_record.ci';
  var str ;

    connection.query(sql,function(err,result){
      if(err){
        console.log('[SELECT ERROR]:',err.message);
      }
      str = JSON.stringify(result)
      console.log(str)
      res.send(str) //给前端返回json格式的数据
    });
  
 
})
app.listen(3000,function(){   
  console.log("Server running at 3000 port");
});


  //console.log(lat_number)




