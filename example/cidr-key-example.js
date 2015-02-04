// cidr-index-example.js
// Uses CIDR dictionary and BaseIP module.


var Base = require('../BaseIP.js');
var fs = require('fs'),
    dict = JSON.parse(fs.readFileSync('../data/subnet-dictionary-key-based.json'))

var debug = true;
function log (s) { if (debug) { console.log(s); }}

var cidr = function () { return Math.floor(Math.random() * 32); }

// Choose a random cidr number.
var chosen = '/' + cidr();

// Create a new Base IP given the Cidr.
var b = new Base(dict[chosen])

// Show the standard form and cidr form.
log(b.standard())
log(b.cidr())