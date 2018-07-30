var yarn = require('@yarnpkg/lockfile')
exports.parseDependencies = function(manifest) {
  var dependencies = yarn.parse(manifest).object
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
  return deps;
}
