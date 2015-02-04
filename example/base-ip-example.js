// base-ip-example.js


var Base = require('./BaseIP.js');
var debug = true;
function log (s) { if (debug) { console.log(s); }}

// Multiple Arguments Usage
var subnet = new Base(255,255,255,0);       //=> 255.255.255.0
log(subnet.standard())                      //=> 255.255.255.0
log(subnet.cidr())                          //=> 24
log(subnet.set(0,0,0,0))                    //=> 0.0.0.0
log(subnet.standard())                      //=> 0.0.0.0
log(subnet.cidr())                          //=> 0

// Single Arguments Usage
var another = new Base([255,255,255,248]);  //=> 255.255.255.248
log(another.standard())                     //=> 255.255.255.248
log(another.cidr())                         //=> 29

//=> Not a valid IP Address. Using default: 0.0.0.0
var dumbSubnet = new Base([256,0,0,0]);