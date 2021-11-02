var yaml = require('js-yaml')
var yarn = require('@yarnpkg/lockfile')

function splitNameAndVersion(nameAndVersion) {
  // e.g. 'tweetnacl@^0.14.3, tweetnacl@~0.14.0' or '"tweetnacl@npm:^0.14.3, tweetnacl@npm:~0.14.0":'
  var possibleMultipleRequirements = nameAndVersion.split(', ');
  // only use first requirement's name, assuming that deps will always resolve from deps of the same name.
  nameAndVersion = possibleMultipleRequirements[0];

  var nameAndVersionWithoutLeadingAt = nameAndVersion.replace(/^@/, '');

  var name = nameAndVersionWithoutLeadingAt.split('@')[0];
  var versions = [];
  possibleMultipleRequirements.forEach((requirement) => {
    var sep = requirement.split('@');
    var version = sep.slice(1, sep.length).join('@').replace(/npm:/, ''); // e.g. "npm:^0.14.3"
    versions.push(version);
  })
  var version = versions.join(' '); // comparator intersection (https://classic.yarnpkg.com/lang/en/docs/dependency-versions/#toc-intersections)

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
      requirement: getVersionFromVersionString(dep),
      type: 'runtime'
    })
  })

  return deps;
}
