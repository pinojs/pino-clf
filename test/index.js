'use strict'

var clf = require('../')
var through = require('through2')
var test = require('tap').test
var getCLFOffset = require('./lib/get-clf-offset')

var log = '{"pid":13961,"hostname":"MacBook-Pro-4","level":30,"time":1469122492244,"msg":"request completed","res":{"statusCode":200,"header":"HTTP/1.1 200 OK\\r\\ncontent-type: application/json; charset=utf-8\\r\\ncache-control: no-cache\\r\\nvary: accept-encoding\\r\\ncontent-encoding: gzip\\r\\ndate: Thu, 21 Jul 2016 17:34:52 GMT\\r\\nconnection: close\\r\\ntransfer-encoding: chunked\\r\\n\\r\\n"},"responseTime":17,"req":{"id":8,"method":"GET","url":"/api/activity/component","headers":{"host":"localhost:20000","connection":"keep-alive","cache-control":"max-age=0","authorization":"Basic QWxhZGRpbjpPcGVuU2VzYW1l","accept":"application/json","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36","referer":"http://localhost:20000/","accept-encoding":"gzip, deflate, sdch","accept-language":"en-US,en;q=0.8,de;q=0.6","cookie":"_ga=GA1.1.204420087.1444842476"},"remoteAddress":"127.0.0.1","remotePort":61543},"v":1}\n'

var offset = getCLFOffset(new Date(1469122492244))
var combined = '127.0.0.1 - Aladdin [21/Jul/2016:17:34:52 ' + offset + '] "GET /api/activity/component HTTP/1.1" 200 - "http://localhost:20000/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"\n'
var access = '127.0.0.1 - Aladdin [21/Jul/2016:17:34:52 ' + offset + '] "GET /api/activity/component HTTP/1.1" 200 -\n'
var referral = '[21/Jul/2016:17:34:52 ' + offset + '] "http://localhost:20000/"\n'
var agent = '[21/Jul/2016:17:34:52 ' + offset + '] "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"\n'

process.stdout.setMaxListeners(Infinity)

test('combined', function (t) {
  var expected = combined
  var stream = through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  })
  var logger = clf('combined', stream)
  logger.write(log)
})

test('combined (default)', function (t) {
  var expected = combined
  var stream = through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  })
  var logger = clf('', stream)
  logger.write(log)
})

test('combined (one element dest array)', function (t) {
  var expected = combined
  var stream = through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  })
  var logger = clf('combined', [stream])
  logger.write(log)
})

test('common (single dest)', function (t) {
  var expected = access
  var stream = through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  })
  var logger = clf('common', stream)
  logger.write(log)
})

test('common (one element dest array)', function (t) {
  var expected = access
  var stream = through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  })
  var logger = clf('common', [stream])
  logger.write(log)
})

test('common (two element dest array)', function (t) {
  var c = 0

  var stream1 = through(function (line) {
    t.is(line.toString(), access)
    c++
    if (c === 2) t.end()
  })
  var stream2 = through(function (line) {
    t.is(line.toString(), referral)
    c++
    if (c === 2) t.end()
  })
  var logger = clf('common', [stream1, stream2])
  logger.write(log)
})

test('common (three element dest array)', function (t) {
  var c = 0

  var stream1 = through(function (line) {
    t.is(line.toString(), access)
    c++
    if (c === 3) t.end()
  })
  var stream2 = through(function (line) {
    t.is(line.toString(), referral)
    c++
    if (c === 3) t.end()
  })
  var stream3 = through(function (line) {
    t.is(line.toString(), agent)
    c++
    if (c === 3) t.end()
  })
  var logger = clf('common', [stream1, stream2, stream3])
  logger.write(log)
})

test('common (2 log files - skip first)', function (t) {
  var c = 0

  var stream1 = through(function (line) {
    t.is(line.toString(), referral)
    c++
    if (c === 2) t.end()
  })
  var stream2 = through(function (line) {
    t.is(line.toString(), agent)
    c++
    if (c === 2) t.end()
  })
  var logger = clf('common', [0, stream1, stream2])
  logger.write(log)
})

test('common (2 log files - skip middle)', function (t) {
  var c = 0

  var stream1 = through(function (line) {
    t.is(line.toString(), access)
    c++
    if (c === 2) t.end()
  })
  var stream2 = through(function (line) {
    t.is(line.toString(), agent)
    c++
    if (c === 2) t.end()
  })

  var logger = clf('common', [stream1, 0, stream2])
  logger.write(log)
})

test('logs to process.stdout by default (combined)', function (t) {
  var expected = combined

  var write = process.stdout.write
  process.stdout.write = function (chunk, enc, cb) {
    process.stdout.write = write
    t.is(chunk.toString(), expected)
    t.end()
  }

  var logger = clf('combined')
  logger.write(log)
})

test('logs to process.stdout by default (common)', function (t) {
  var expected = access

  var write = process.stdout.write
  process.stdout.write = function (chunk, enc, cb) {
    process.stdout.write = write
    t.is(chunk.toString(), expected)
    t.end()
  }

  var logger = clf('common')
  logger.write(log)
})

test('logs to process.stdout by default (combined - empty dest array)', function (t) {
  var expected = combined

  var write = process.stdout.write
  process.stdout.write = function (chunk, enc, cb) {
    process.stdout.write = write
    t.is(chunk.toString(), expected)
    t.end()
  }

  var logger = clf('combined', [])
  logger.write(log)
})

test('logs to process.stdout by default (common - empty dest array)', function (t) {
  var expected = access

  var write = process.stdout.write
  process.stdout.write = function (chunk, enc, cb) {
    process.stdout.write = write
    t.is(chunk.toString(), expected)
    t.end()
  }

  var logger = clf('common', [])
  logger.write(log)
})

test('type as object', function (t) {
  var expected = combined
  var stream = through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  })
  var logger = clf({type: 'combined'}, stream)
  logger.write(log)
})

test('type as object without specified type', function (t) {
  var expected = combined
  var stream = through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  })
  var logger = clf({}, stream)
  logger.write(log)
})

test('ancillary: passes non-http messages to alternative stream when specified', function (t) {
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var logger = clf('combined', through(), through(function (line) {
    t.is(line.toString(), msg)
    t.end()
  }))
  logger.write(msg)
})

test('unknown type causes throw', function (t) {
  t.throws(function () { clf('unknown') })
  t.end()
})

test('keep: passes all messages to alternative stream', function (t) {
  var expected = combined
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var count = 0
  var logger = clf({type: 'combined', keep: true}, through(function (line, _, cb) {
    t.is(line + '', expected)
    t.end()
    cb()
  }), through(function (line, _, cb) {
    count++

    if (count === 1) {
      t.is(line + '', msg)
    }
    if (count === 2) {
    }
    cb()
  }))

  logger.write(msg)
  logger.write(log)
})

test('outputs newline when stream ends', function (t) {
  var expected = '\n'
  var stream = through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  })
  clf('combined', stream)
  stream.end()
})

test('outputs error message when error in pipeline', function (t) {
  var expected = 'premature close\n'
  var stream = through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  })
  clf('combined', stream)
  stream.destroy()
})

test('filters non-http messages by default', function (t) {
  var logger = clf('combined', through(function (line) {
    t.fail()
    t.end()
  }))
  logger.write('{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n')
  setTimeout(function () {
    t.pass()
    t.end()
  }, 100)
})

