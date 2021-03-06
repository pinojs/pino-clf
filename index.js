'use strict'

var through = require('through2')
var pump = require('pump')
var toke = require('pino-toke')
var combined = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
var access = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'
var referral = '[:date[clf]] ":referrer"'
var agent = '[:date[clf]] ":user-agent"'

module.exports = commonLog

function commonLog (type, dest, ancillary) {
  type = type || 'combined'
  dest = dest || process.stdout
  var keep
  if (typeof type === 'object') {
    keep = type.keep
    type = type.type || 'combined'
  }
  if (type === 'combined') {
    if (Array.isArray(dest)) dest = dest[0] || process.stdout
    return toke({format: combined, keep: keep}, dest, ancillary)
  }
  if (type === 'common') {
    if (!Array.isArray(dest)) return toke({format: access, keep: keep}, dest, ancillary)
    if (!dest[0] && !dest[1] && !dest[2]) dest[0] = process.stdout
    var stream = through()
    if (dest[0]) pump(stream, toke({format: access, keep: keep}, dest[0], ancillary))
    if (dest[1]) pump(stream, toke({format: referral, keep: keep}, dest[1], !dest[0] && ancillary))
    if (dest[2]) pump(stream, toke({format: agent, keep: keep}, dest[2], !dest[1] && ancillary))

    return stream
  }
  throw Error('Unrecognized log format type: ' + type)
}
