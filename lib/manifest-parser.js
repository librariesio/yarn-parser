var yarn = require('@yarnpkg/lockfile')
exports.parseDependencies = function(manifest) {
  var dependencies = yarn.parse(manifest).object
  var deps = []
  Object.keys(dependencies).forEach((dep) => {
    var sep = dep.split('@');
    var name = sep.slice(0, sep.length - 1).join('@');
    deps.push({
      name: name,
      version: dependencies[dep].version,
      type: 'runtime'
    })
  })
  return deps;
}
