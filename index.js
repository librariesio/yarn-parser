
var express = require('express')
var bodyParser = require('body-parser')
var manifestParser = require('./lib/manifest-parser')
var app = express()
var port = process.env.PORT || 5000;

app.disable('x-powered-by');

app.use(function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.post("/parse/", bodyParser.text({type: '*/*', limit: '5mb'}), function(req,res){
  var deps = manifestParser.parseDependencies(req.body);
  res.json(deps);
});

app.get("/", function(req,res) {
  res.send("OK")
});

app.use(function(err, req, res, next) {
  console.error('ERR:', err);
  console.error('STACK:', err.stack);
  console.error('FILE:' req.body);
  res.status(500).send({error: 'Something went wrong.'});
});

app.listen(port, function() {
  console.log('Listening on', port);
});
