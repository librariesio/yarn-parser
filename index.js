var yarn = require('@yarnpkg/lockfile')
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var port = process.env.PORT || 5000;

app.disable('x-powered-by');

app.use(function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.post("/parse/", bodyParser.text({type: '*/*', limit: '5mb'}), function(req,res){
  var dependencies = yarn.parse(req.body).object
  var deps = []
  Object.keys(dependencies).forEach((dep) => {
    var name = dep.split('@')[0]
    if (/^@/.test(dep)) {
      name = '@' + dep.split('@')[1]
    }
    deps.push({
      name: name,
      version: dependencies[dep].version,
      type: 'runtime'
    })
  })

  res.json(deps)
});

app.get("/", function(req,res) {
  res.send("OK")
});

app.use(function(err, req, res, next) {
  console.error('ERR:', err);
  console.error('STACK:', err.stack);
  res.status(500).send({error: 'Something went wrong.'});
});

app.listen(port, function() {
  console.log('Listening on', port);
});
