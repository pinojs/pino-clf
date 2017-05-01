'use strict'

module.exports = getCLFOffset

// adapted from https://github.com/lludol/clf-date/blob/master/src/main.js
function getCLFOffset (date) {
  var offset = date.getTimezoneOffset().toString()
  var op = offset[0] === '-' ? '-' : '+'
  var number = offset.replace(op, '')

  while (number.length < 4) { number = `0${number}` }

  return `${op}${number}`
}
