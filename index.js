var parser = require('tap-parser')
var persist = require('./lib/persist')

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1
}

var p = parser(function (results) {
  var files = []

  var failed_tests = results.fail.filter(function (value) {
    if (endsWith(value.name, '.tap.js')) {
      files.push(value.name)
      return false
    }
    return true
  })

  failed_tests = failed_tests.map(function (value) {
    return value.number
  })

  failed_tests.sort(function (a, b) {
    return a-b
  })

  var file_test = results.pass.filter(function (value) {
    if (failed_tests[0] === undefined) {
      return false
    }
    if (value.number < failed_tests[0]) {
      return false
    }
    if (!endsWith(value.name, '.tap.js')) {
      return false
    }
    while (failed_tests[0] < value.number) {
      failed_tests.shift()
    }

    return true
  })

  files = files.concat(file_test.map(function (value) {
    return value.name
  }))

  persist(process.cwd(), files)
  if (files.length) {
    console.log()
    console.log('# Files with failures:')
    files.forEach(function (file) {
      console.log('#   %s', file)
    })
  } else {
    console.log('all is good!')
  }


})


process.stdin.pipe(p)
process.stdin.pipe(process.stdout)