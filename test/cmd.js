'use strict'

var cp = require('child_process')
var path = require('path')
var fs = require('fs')
var test = require('tap').test

var log = '{"pid":13961,"hostname":"MacBook-Pro-4","level":30,"time":1469122492244,"msg":"request completed","res":{"statusCode":200,"header":"HTTP/1.1 200 OK\\r\\ncontent-type: application/json; charset=utf-8\\r\\ncache-control: no-cache\\r\\nvary: accept-encoding\\r\\ncontent-encoding: gzip\\r\\ndate: Thu, 21 Jul 2016 17:34:52 GMT\\r\\nconnection: close\\r\\ntransfer-encoding: chunked\\r\\n\\r\\n"},"responseTime":17,"req":{"id":8,"method":"GET","url":"/api/activity/component","headers":{"host":"localhost:20000","connection":"keep-alive","cache-control":"max-age=0","authorization":"Basic QWxhZGRpbjpPcGVuU2VzYW1l","accept":"application/json","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36","referer":"http://localhost:20000/","accept-encoding":"gzip, deflate, sdch","accept-language":"en-US,en;q=0.8,de;q=0.6","cookie":"_ga=GA1.1.204420087.1444842476"},"remoteAddress":"127.0.0.1","remotePort":61543},"v":1}\n'
var cwd = path.resolve(__dirname, '..')

var combined = '127.0.0.1 - Aladdin [21/Jul/2016:17:34:52 -0060] "GET /api/activity/component HTTP/1.1" 200 - "http://localhost:20000/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"\n'
var access = '127.0.0.1 - Aladdin [21/Jul/2016:17:34:52 -0060] "GET /api/activity/component HTTP/1.1" 200 -\n'
var referral = '[21/Jul/2016:17:34:52 -0060] "http://localhost:20000/"\n'
var agent = '[21/Jul/2016:17:34:52 -0060] "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"\n'

test('-h', function (t) {
  var expected = fs.readFileSync(path.join(cwd, 'usage.txt')) + '\n'
  var args = ['-h']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('--help', function (t) {
  var expected = fs.readFileSync(path.join(cwd, 'usage.txt')) + '\n'
  var args = ['--help']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('combined (default)', function (t) {
  var expected = combined
  var args = []
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('combined (specified)', function (t) {
  var expected = combined
  var args = ['combined']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('common (access)', function (t) {
  var expected = access
  var args = ['common']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('unknown (error case)', function (t) {
  var expected = 'Unrecognized log format type: unknown\n'
  var args = ['unknown']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[2] + '', expected)
  t.is(result.status, 1)

  t.end()
})

test('-d', function (t) {
  var expected = combined
  var args = ['-d', '2']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[2] + '', expected)

  t.end()
})

test('--destination', function (t) {
  var expected = combined
  var args = ['--destination', '2']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[2] + '', expected)

  t.end()
})

test('--dest', function (t) {
  var expected = combined
  var args = ['--dest', '2']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[2] + '', expected)

  t.end()
})

test('-d with custom fd', function (t) {
  var expected = combined
  var args = ['-d', '3']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[3] + '', expected)

  t.end()
})

test('-d 1', function (t) {
  var expected = combined
  var args = ['-d', '1']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('-d stderr', function (t) {
  var expected = combined
  var args = ['-d', 'stderr']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[2] + '', expected)

  t.end()
})

test('-d stdout', function (t) {
  var expected = combined
  var args = ['-d', 'stdout']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('-d 1 d 2 -d 3 common (three-log format)', function (t) {
  var args = ['-d', '1', '-d', '2', '-d', '3', 'common']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', access)
  t.is(result.output[2] + '', referral)
  t.is(result.output[3] + '', agent)

  t.end()
})

test('-d [1,2,3] common (three-log format)', function (t) {
  var args = ['-d', '[1,2,3]', 'common']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', access)
  t.is(result.output[2] + '', referral)
  t.is(result.output[3] + '', agent)

  t.end()
})

test('-d [1,2] common (two-log)', function (t) {
  var args = ['-d', '[1,2]', 'common']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', access)
  t.is(result.output[2] + '', referral)

  t.end()
})

test('-d [1,0,2] common (two log - skip referral)', function (t) {
  var args = ['-d', '[1,0,2]', 'common']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', access)
  t.is(result.output[2] + '', agent)

  t.end()
})

test('-d [0,1,2] common (two log - skip access)', function (t) {
  var args = ['-d', '[0,1,2]', 'common']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', referral)
  t.is(result.output[2] + '', agent)

  t.end()
})

test('-d [1,null,2] common (two log - skip referral)', function (t) {
  var args = ['-d', '[1,0,2]', 'common']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', access)
  t.is(result.output[2] + '', agent)

  t.end()
})

test('-d [] combined - bogus, but will output combined log to stdout', function (t) {
  var args = ['-d', '[]', 'combined']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', combined)

  t.end()
})

test('-d [] common - bogus, but will output access log to stdout', function (t) {
  var args = ['-d', '[]', 'common']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', access)

  t.end()
})

test('-a', function (t) {
  var expected = combined
  var args = ['-a', '2', 'combined']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', expected)
  t.is(result.output[2] + '', msg)

  t.end()
})

test('--ancillary', function (t) {
  var expected = combined
  var args = ['--ancillary', '2', 'combined']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', expected)
  t.is(result.output[2] + '', msg)

  t.end()
})

test('-a with custom fd', function (t) {
  var expected = combined
  var args = ['-a', '3', 'combined']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', expected)
  t.is(result.output[3] + '', msg)

  t.end()
})

test('-a 1 -d 2', function (t) {
  var expected = combined
  var args = ['-a', '1', '-d', '2', 'combined']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[2] + '', expected)
  t.is(result.output[1] + '', msg)

  t.end()
})

test('-a stderr', function (t) {
  var expected = combined
  var args = ['-a', 'stderr', 'combined']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', expected)
  t.is(result.output[2] + '', msg)

  t.end()
})

test('-a stdout -d 2', function (t) {
  var expected = combined
  var args = ['-a', 'stdout', '-d', '2', 'combined']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[2] + '', expected)
  t.is(result.output[1] + '', msg)

  t.end()
})

test('-a 1 -d 1', function (t) {
  var expected = combined
  var args = ['-a', '1', '-d', '1', 'combined']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })
  t.is(result.output[1] + '', expected + msg)

  t.end()
})

test('-k -a 2', function (t) {
  var expected = combined
  var args = ['-k', '-a', '2', 'combined']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', expected)
  t.is(result.output[2] + '', log + msg)

  t.end()
})

test('-d [1,2,3] -a 4 common', function (t) {
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var args = ['-d', '[1,2,3]', '-a', '4', 'common']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', access)
  t.is(result.output[2] + '', referral)
  t.is(result.output[3] + '', agent)
  t.is(result.output[4] + '', msg)

  t.end()
})

test('redirect custom fd to file', function (t) {
  var expected = combined + '\n'
  var tmp = path.join(__dirname, 'tmp')
  var out = fs.openSync(tmp, 'w')
  var args = ['-d', '3', 'combined']
  cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe', out],
    input: log
  })

  t.is(fs.readFileSync(tmp).toString() + '', expected)
  fs.unlinkSync(tmp)

  t.end()
})

