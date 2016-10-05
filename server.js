var fs = require('fs');
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(express.static('public'));
app.use(urlencodedParser);
app.use(bodyParser.json());

// Constants
var publicPath = __dirname + "/public/";

// mongodb connection
mongoose.connect('mongodb://localhost/tododb', function (err) {
    if (err) {
        console.log(err);
    }
});

var db = mongoose.connection;
db.on('error', function (err) {
  console.warn(err);
});
db.once('open', function () {
  console.info('Connected to mongodb');
});

// mongodb shema, models
var todoSchema = mongoose.Schema({
    name: String,
	priority: String,
    description: String,
	done: Boolean
});
var todoModel = mongoose.model('todolist', todoSchema);

// Web API's
app.get('/getTodo', function (req, res) {
  todoModel.find(function (err, docs) {
    if (err) {
      throw err;
    }
    console.log(docs);
    res.send(docs);
  });
});

app.get('/getTodo/:id', function (req, res) {
    todoModel.find({ "_id": req.params.id }, function (err, docs) {
        if (err) {
            throw err;
        }
        res.json(docs);
    });
});

app.post('/saveTodo', urlencodedParser, function (req, res) {
    var newTodo = todoModel({
        "name": req.body.name,
        "description": req.body.description,
		"priority": req.body.priority,
		"done": req.body.done
    });

    newTodo.save({}, function (err, docs) {
        if (err) {
          throw err;
        }
        res.json(docs);
    });
});

app.post('/setTodoDone', urlencodedParser, function (req, res) {
	var query = {
		"_id": req.body.id
	};
	
	var updateData = {
		"done": true
	};
	
	todoModel.findOneAndUpdate(query, updateData, {upsert: true}, function(err, doc) {
		if(err) {
			throw err;
		}
		res.json(doc);
	});
});

app.get('/removeTodo/:id', urlencodedParser, function (req, res) {
    todoModel.remove({ "_id": req.params.id }, function (err, docs) {
      if (err) {
        throw err;
      }
      res.json(docs);
    });
});

// main
app.get('/', function (req, res) {
  /*
    fs.readFile(publicPath + "index.html", "utf8", function (err, data) {
        res.end(data);
    });
  */
  res.sendFile(publicPath + '\\index.html');
});

// express
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Listening at http://%s:%s", host, port);
});
