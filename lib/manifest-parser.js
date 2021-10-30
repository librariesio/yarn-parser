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
  var deps = []

  if (isYarnLockFileV2(manifest)) {
    var dependencies = yaml.load(manifest, {
      json: true,
      schema: yaml.FAILSAFE_SCHEMA,
    });
    Object.keys(dependencies).forEach((dep) => {
      if (dep === '__metadata') { return; }
      deps.push({
        name: getNameFromVersionString(dep),
        version: dependencies[dep].version,
        requirement: getVersionFromVersionString(dep), // TODO: test what happens with tweetnacl double requirement here?
        type: 'runtime'
      })
    })
  } else {
    var dependencies = yarn.parse(manifest).object
    Object.keys(dependencies).forEach((dep) => {
      deps.push({
        name: getNameFromVersionString(dep),
        version: dependencies[dep].version,
        requirement: getVersionFromVersionString(dep),
        type: 'runtime'
      })
    })
  }

  return deps;
}


