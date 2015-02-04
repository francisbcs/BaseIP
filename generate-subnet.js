// generate-subnet.js
// A series of for-loops to generate the 33 (/0 -> /32) subnets in JSON.
// TODO: write the iterations to be more succinct given a base array.
// function generate (base) { /* code */} => all 8 subnets

// Module Dependencies.
var fs = require('fs');
var debug = false;
function log (s) { if (debug) { console.log(s); }}

var config = { output: 'both' };

// setup
var given = [0, 128, 192, 224, 240, 248, 252, 254, 255];
var first = [], second = [], third = [], fourth = [];

// first set
given.forEach(function (el) {
    var base = [0,0,0,0];
    base[0] = el;
    first.push(base);
});
first.pop();

// second set
given.forEach(function (el) {
    var base = [255,0,0,0];
    base[1] = el
    second.push(base);
})
second.pop();

// third set
given.forEach(function (el) {
    var base = [255,255,0,0];
    base[2] = el;
    third.push(base);
})
third.pop();

// fourth set
given.forEach(function (el) {
    var base = [255,255,255,0];
    base[3] = el;
    fourth.push(base);
});

var dictionary = first.concat(second, third, fourth);
var output = null;

// Write out files.
if (config.output == 'both') {
    var outfile = './data/subnet-dictionary-index-based.json';
    output = JSON.stringify(dictionary);
    fs.writeFile(outfile, output, function (err) {
        if (err) {
            throw err;
        }
    });

    var outfile = './data/subnet-dictionary-key-based.json';
    output = {};
    dictionary.forEach(function (el, index) {
        // Cidr notation has a slash prepended.
        var name = '/' + index;
        output[name] = el;
    });

    output = JSON.stringify(output);
    fs.writeFile(outfile, output, function (err) {
        if (err) {
            throw err;
        }
    });
}
