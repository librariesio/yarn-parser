var yarn = require('yarn/lib/lockfile/wrapper.js')
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var port = process.env.PORT || 5000;

app.use(bodyParser.text());
app.disable('x-powered-by');

app.use(function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.bodyParser({limit: '5mb'}));

app.post("/parse/", bodyParser.text({type: '*/*'}), function(req,res){
  var dependencies = yarn.parse(req.body)
  var deps = []
  Object.keys(dependencies).forEach((dep) => {
    deps.push({
      name: dep.split('@')[0],
      version: dependencies[dep].version,
      type: 'runtime'
    })
  })

  res.json(deps)
});

app.use(function(err, req, res, next) {
  console.error('ERR:', err);
  console.error('STACK:', err.stack);
  res.status(500).send({error: 'Something went wrong.'});
});

app.listen(port, function() {
  console.log('Listening on', port);
});
