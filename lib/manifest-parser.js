var yarn = require('@yarnpkg/lockfile')

function splitNameAndVersion(nameAndVersion) {
  var sep = nameAndVersion.split('@');
  var name = sep.slice(0, sep.length - 1).join('@');
  var version = sep[sep.length - 1];

  return [name, version];
}

function getNameFromVersionString(nameAndVersion) {
  return splitNameAndVersion(nameAndVersion)[0];
}
exports.getNameFromVersionString = getNameFromVersionString;

function getVersionFromVersionString(nameAndVersion) {
  return splitNameAndVersion(nameAndVersion)[1];
}

exports.parseDependencies = function(manifest) {
  var dependencies = yarn.parse(manifest).object
  var deps = []
  Object.keys(dependencies).forEach((dep) => {
    deps.push({
      name: getNameFromVersionString(dep),
      version: dependencies[dep].version,
      requirement: getVersionFromVersionString(dep),
      type: 'runtime'
    })
  })
  return deps;
}
