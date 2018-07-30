var expect  = require('chai').expect;
var request = require('request');
var manifestParser = require('../lib/manifest-parser');
var fs = require('fs')

it('Parses body', function(done) {
  var tmp = fs.readFileSync('./test/fixtures/yarn.lock', 'utf-8');
  var deps = manifestParser.parseDependencies(tmp);
  expect(deps.length).to.equal(140);
  done();
});

it('Correctly parses yarn.lock', function(done) {
  var tmp = fs.readFileSync('./test/fixtures/yarn.lock', 'utf-8');
  var deps = manifestParser.parseDependencies(tmp);
  expect(deps[0].name).to.equal('@yarnpkg/lockfile');
  expect(deps[0].version).to.equal('1.0.0');
  expect(deps[1].name).to.equal('accepts');
  expect(deps[2].name).to.equal('ajv');
  done();
});
it('Correctly parses packages with @ symbol in name', function(done) {
  expect(manifestParser.getNameFromVersionString('@yarnpkg/lockfile@^1.0.0')).to.equal('@yarnpkg/lockfile');
  expect(manifestParser.getNameFromVersionString('@babel/code-frame@7.0.0-beta.44')).to.equal('@babel/code-frame');
  done();
});

it('Correctly parses packages with plain old names', function(done) {
  expect(manifestParser.getNameFromVersionString('uuid@~1.1.2')).to.equal('uuid');
  done();
});
