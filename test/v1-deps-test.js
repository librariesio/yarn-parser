var expect = require('chai').expect;
var request = require('request');
var fs = require('fs')

var manifestParser = require('../lib/manifest-parser');

describe('splitNameAndVersionString', function() {
  it('Correctly parses packages with @ symbol in name', function(done) {
    expect(manifestParser.getNameFromVersionString('@yarnpkg/lockfile@^1.0.0')).to.equal('@yarnpkg/lockfile');
    expect(manifestParser.getNameFromVersionString('@babel/code-frame@7.0.0-beta.44')).to.equal('@babel/code-frame');
    done();
  });
  it('Correctly parses packages with plain old names', function(done) {
    expect(manifestParser.getNameFromVersionString('uuid@~1.1.2')).to.equal('uuid');
    done();
  });
  it('Correctly parses version requirments for git repos', function(done) {
    expect(
      manifestParser.getVersionFromVersionString(
        'private-dep@https://github.com/myorg/private-dep.git#v1.2.3'
      )
    ).to.equal('https://github.com/myorg/private-dep.git#v1.2.3');
    expect(
      manifestParser.getVersionFromVersionString(
        'private-dep@git+ssh://git@github.com/myorg/private-dep.git#v1.2.3'
      )
    ).to.equal('git+ssh://git@github.com/myorg/private-dep.git#v1.2.3');
    done();
  });
  it('Correctly parses multiple version requirements for a single package', function(done) {
    expect(manifestParser.getVersionFromVersionString('tweetnacl@^0.14.3, tweetnacl@~0.14.0')).to.equal('^0.14.3 ~0.14.0');
    done();
  });
});

describe('parsing v1', function() {
  it('Parses body', function(done) {
    var tmp = fs.readFileSync('./test/fixtures/yarn.v1.lock', 'utf-8');
    var deps = manifestParser.parseDependencies(tmp);
    expect(deps.length).to.equal(140);
    done();
  });

  it('Correctly parses yarn.lock', function(done) {
    var tmp = fs.readFileSync('./test/fixtures/yarn.v1.lock', 'utf-8');
    var deps = manifestParser.parseDependencies(tmp);
    expect(deps[0].name).to.equal('@yarnpkg/lockfile');
    expect(deps[0].version).to.equal('1.0.0');
    expect(deps[1].name).to.equal('accepts');
    expect(deps[2].name).to.equal('ajv');
    done();
  });
  it('parses a yarn.lock with a git reference', function(done) {
    var tmp = fs.readFileSync('./test/fixtures/yarn-with-git-repo.v1.lock', 'utf-8');
    var deps = manifestParser.parseDependencies(tmp);
    expect(deps[0].name).to.equal('vue');
    expect(deps[0].version).to.equal('2.6.12');
    expect(deps[0].requirement).to.equal('https://github.com/vuejs/vue.git#v2.6.12');
    done();
  });
});

