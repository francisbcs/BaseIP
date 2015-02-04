/**
 * A Base class for writing any address in IPv4.
 *
 * @param {String|Array} address
 *
 * Example
 * foo = new Base([0,0,0,0])
 * bar = new Base(0,0,0,0)
 */
function Base (address) {

    // Alias `this` to `self` so that any publicly exposed methods
    // can have access to the properties defined on `Base`.
    var self = this;

    // Clone the array-like `arguments` into `this.args`.
    this.args = [];
    for (var i = 0, il = arguments.length; i < il; ++i) {
        this.args[i] = arguments[i];
    }

    // Default value for invalid addresses.
    this._defaultAddress = [0,0,0,0];
    this.address = null;

    // Validates an array-style address.
    var listStyle = (this.args.length === 1
        && isArray(this.args[0])
        && every.call(this.args[0], isInteger)
        && every.call(this.args[0], withinRange));

    // Validates a comma-separated integer-style address.
    var commaStyle = (this.args.length === 4
        && every.call(this.args, isInteger)
        && every.call(this.args, withinRange));

    if (listStyle) {
        this.address = address;
    } else if (commaStyle) {
        this.address = this.args;
    } else {
        var message = 'Not a valid IP Address. Using default:';
        console.warn(message, this._defaultAddress.join('.'));
        this.address = this._defaultAddress;
    }

    return {
        standard: function () {
            return self.address.join('.');
        },
        integer: function () {
            var sum = 0;
            // http://www.bennadel.com/blog/1830-converting-ip-addresses-to-and-from-integer-values-with-coldfusion.htm
            // TL;DR: shift each unit over by sets of 8 bits
            sum += self.address[0] << 24 /* 3 sets */
            sum += self.address[1] << 16 /* 2 sets */
            sum += self.address[2] << 8  /* 1 set */
            sum += self.address[3]
            return sum;
        },
        cidr: function () {
            var sum = 0;

            // Each entry of an IP address can only be between 0 and 255.
            // When converting the IP address to CIDR format,
            // each entry represents the number of ones present in its binary representation.

            // For instance, 255 in binary is 11111111.
            // So it's entry will be cast as "8" since there are eight ones present.
            // Another example: 192 in binary is 11000000.
            // So 192's entry will be cast as "2" since there are two ones present.
            self.address.forEach(function (entry) {
                sum += binary(entry)
                            // Split each element of the number's binary form into an array.
                            .split('')
                            // Map each element as an integer.
                            .map(castAsInteger)
                            // Filter only for the elements that are equal to one.
                            .filter(isOne)
                            // Count up the ones present.
                            .length
            });

            return sum;
        },
        // Set the IP Address.
        set: function (address) {

            // Locally scoped to this function to avoid collision.
            var args = [];

            for (var i = 0, il = arguments.length; i < il; ++i) {
                args[i] = arguments[i];
            }

            if (listStyle) {
                self.address = address;
            } else if (commaStyle) {
                self.address = args;
            } else {
                console.warn('Not valid IP Address. Using default:', self._defaultAddress);
            }

            return this.standard();
        }
    }
}

// Function Utilities
function isArray(arr) {
    return Object.prototype.toString.call(arr).slice(8, -1) === "Array";
}

function isNumber(n) {
    return Number(n) === n;
}

function isInteger(n) {
    return isNumber(n) && n % 1 === 0;
}

function isBetween (target, a, b) {
    var min = Math.min(a,b),
        max = Math.max(a,b);

    return target >= min && target <= max;
}

function withinRange(n) {
    return isBetween(n, 0, 255);
}

function binary (n) {
    return (n).toString(2);
}

function castAsInteger (str) {
    return +str;
}

function isOne (n) {
    return n === 1;
}

var each = [].forEach;
var every = [].every;

module.exports = Base;

