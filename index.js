const express = require('express');
const app = express();
const router = express.Router();
var cassandra = require('cassandra-driver');
var bodyParser = require('body-parser');
var multer = require('multer');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(urlencodedParser);
app.use(bodyParser.json());

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.get("/",function(req,res){
	res.send("<html><head></head> <body><h1>EXAMPLE</body></h1></html>");
});

router.post("/deposit", upload.single('contents'), function(req,res){
	var client = new cassandra.Client({contactPoints: ['127.0.0.1'],  keyspace:'hw6', localDataCenter: 'datacenter1'});
	var depositQuery = 'INSERT INTO imgs (filename, contents) VALUES (?, ?)';
	var name = req.body.filename;
	var item = req.body.contents;
	client.execute(depositQuery, [name, req.file.buffer], function(err, result){
	console.log(req.file.buffer);
	});
	res.send();
});

router.get("/retrieve",function(req,res){
	var client = new cassandra.Client({contactPoints: ['127.0.0.1'],  keyspace:'hw6', localDataCenter: 'datacenter1'});
	var fileName = req.query.filename;
	const withdrawQuery = 'SELECT contents FROM imgs WHERE filename = ?';
	//var queryString = req.body.filename;
	console.log('da string: ' + fileName);
	client.execute(withdrawQuery, [fileName], function(err, result){
		console.log('fileName' + fileName);
		console.log(result);
		var imageType = fileName.split('.').pop();
		res.writeHead(200,{'Content-Type' : 'image/' + imageType});
		res.end(result.rows[0].contents);
		//res.status(200).send(result);
		/*client.execute(withdrawQuery, result.rows, function(err, result2){
			console.log('result2' + result);
			res.status(200).send(result2.rows);
		});*/
	});
});

app.use('/', router); 
app.listen(80); 
console.log('Running frontend server at Port 80');

