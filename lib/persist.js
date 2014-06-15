var fs = require('fs')
var path = require('path')

var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var storage_path = path.join(home, '.tap-failed')

module.exports = function update (name, files) {
  var storage

  if (!fs.existsSync(storage_path)) {
    storage = {}
  } else {
    var raw_storage = fs.readFileSync(storage_path, {encoding: 'utf8'})
    storage = JSON.parse(raw_storage)
  }

  storage[name] = files

  fs.writeFileSync(storage_path, JSON.stringify(storage, null, 2))
}


