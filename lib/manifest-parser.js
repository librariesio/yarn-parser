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
