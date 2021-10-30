var yaml = require('js-yaml')
var yarn = require('@yarnpkg/lockfile')

function splitNameAndVersion(nameAndVersion) {
  var nameAndVersionWithoutLeadingAt = nameAndVersion.replace(/^@/, '')

  var sep = nameAndVersionWithoutLeadingAt.split('@');
  var name = sep[0];
  var version = sep.slice(1, sep.length).join('@');

  if (/^@/.test(nameAndVersion)) {
    name = '@' + name;
  }

  return [name, version];
}

function getNameFromVersionString(nameAndVersion) {
  return splitNameAndVersion(nameAndVersion)[0];
}
exports.getNameFromVersionString = getNameFromVersionString;

function getVersionFromVersionString(nameAndVersion) {
  return splitNameAndVersion(nameAndVersion)[1];
}
exports.getVersionFromVersionString = getVersionFromVersionString;

function isYarnLockFileV2(manifest) {
  return manifest.match(/__metadata:/)
}

exports.parseDependencies = function(manifest) {
  if (isYarnLockFileV2(manifest)) {
    var dependencies = yaml.load(manifest, {
      onWarning: function(err) { console.log('YAML parsing error: ', err) },
      json: true, // JSON compat mode will overwrite dupe entries instead of throw an error.
      schema: yaml.FAILSAFE_SCHEMA,
    });
  } else {
    var dependencies = yarn.parse(manifest).object
  }

  var deps = []
  Object.keys(dependencies).forEach((dep) => {
    if (dep === '__metadata') { return; }
    deps.push({
      name: getNameFromVersionString(dep),
      version: dependencies[dep].version,
      requirement: getVersionFromVersionString(dep), // TODO: parse  tweetnacl double requirement example properly here, and use comparator intersection set (https://classic.yarnpkg.com/lang/en/docs/dependency-versions/#toc-intersections)
      type: 'runtime'
    })
  })

  return deps;
}


