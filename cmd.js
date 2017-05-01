#!/usr/bin/env node
var format = require('./')
var parse = require('fast-json-parse')
var stdio = require('pino-http-format/stdio')
var args = require('minimist')(process.argv.slice(2), {alias: {
  h: ['help'],
  a: ['ancillary'],
  d: ['dest', 'destination'],
  k: ['keep']
}})

if (args.h) {
  console.log(require('fs').readFileSync(require('path').join(__dirname, 'usage.txt')) + '')
  process.exit(0)
}
var type = args._.join(' ')
var destination
var ancillary

args.d = typeof args.d === 'string' ? parse(args.d).value || args.d : args.d

if ((args.d + '').toLowerCase() === 'stdout') args.d = 1
else if ((args.d + '').toLowerCase() === 'stderr') args.d = 2

if ((args.a + '').toLowerCase() === 'stdout') args.a = 1
else if ((args.a + '').toLowerCase() === 'stderr') args.a = 2

if (args.d === 1) destination = process.stdout
else if (args.d === 2) destination = process.stderr
else if (Array.isArray(args.d)) {
  destination = args.d.map(function (fd) {
    return (fd === 1 ? process.stdout : (fd === 2 ? process.stderr : fd && stdio(fd)))
  })
} else if (args.d !== undefined) destination = stdio(args.d)

if (args.a === 1) ancillary = process.stdout
else if (args.a === 2) ancillary = process.stderr
else if (args.a !== undefined) ancillary = stdio(args.a)

if (args.k) type = {type: type, keep: true}

try {
  process.stdin.pipe(format(type, destination, ancillary))
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
