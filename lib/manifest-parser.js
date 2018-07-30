var yarn = require('@yarnpkg/lockfile')

function getNameFromVersionString(nameAndVersion) {
  var sep = nameAndVersion.split('@');
  var name = sep.slice(0, sep.length - 1).join('@');
  return name;
}
exports.getNameFromVersionString = getNameFromVersionString;

exports.parseDependencies = function(manifest) {
  var dependencies = yarn.parse(manifest).object
  var deps = []
  Object.keys(dependencies).forEach((dep) => {
    deps.push({
      name: getNameFromVersionString(dep),
      version: dependencies[dep].version,
      type: 'runtime'
    })
  })
  return deps;
}
