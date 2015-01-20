"use strict";
var isArray = require('amp-is-array');
var isNumber = require('amp-is-number');
var isObject = require('amp-is-object');
var extend = require('amp-extend');
var degPerRadian = 180 / Math.PI;

/**
 * @constructor Coordinate
 * @description Defines object which can convert between coordinate systems.
 * It is recommended to use one of the Coodinate.STATIC_CONSTRUCTOR functions
 * to generate your first coordinate before conversions. e.g. Coodinate.spherical(...)
 * @param {Object} config
 * {
 *     label: 'type of initial coordinate',
 *     coords: {
 *         x/y/z/r/t/p: 'k-v pairs'
 *     },
 *     isDegree: Boolean
 * }
 */
var Coordinate = function (config) {
    var isRadian,
        isDegree,
        pos = {},
        _x, _y, _z, _r, _t, _p;

    // Override select setters/getts
    Object.defineProperty(this, "isRadian", {
        get: function (x) { return isRadian; },
        set: function (x) {
            isRadian = !!x;
            if (isDegree !== !x) { isDegree = !x; } // jshint ignore:line
        }
    });
    Object.defineProperty(this, "isDegree", {
        get: function (x) { return isDegree; },
        set: function (x) {
            isDegree = x;
            if (isRadian !== !x) { isRadian = !x; } // jshint ignore:line
        }
    });
    Object.defineProperty(pos, "cart2d", {
        get: function (x) { return [_x, _y]; },
        set: function (x) { _x = x[0]; _y = x[1]; }
    });
    Object.defineProperty(pos, "cart3d", {
        get: function (x) { return [_x, _y, _z]; },
        set: function (x) { _x = x[0]; _y = x[1]; _z = x[2]; }
    });
    Object.defineProperty(pos, "polar", {
        get: function (x) { return [_r, _t]; },
        set: function (x) { _r = x[0]; _t = x[1]; }
    });
    Object.defineProperty(pos, "cylindrical", {
        get: function (x) { return [_r, _t, _z]; },
        set: function (x) { _r = x[0]; _t = x[1]; _z = x[2]; }
    });
    Object.defineProperty(pos, "spherical", {
        get: function (x) { return [_r, _t, _p]; },
        set: function (x) { _r = x[0]; _t = x[1]; _p = x[2]; }
    });

    // init from config
    if (config.isDegree && !config.isRadian) {
        this.isDegree = true;
    } else {
        this.isRadian = true;
    }
    if (!config.label || !config.coords) {
        throw new Error("no coordinate type defined");
    }
    this.initialType = config.label;
    this.pos = pos;
    this.pos[config.label] = config.coords;
};



/**
 * Converts current coordinate to cartesian
 * @param  {Object} options
 * @return {Array}  coordinates in respective coordinate format
 */
Coordinate.prototype.cartesian = function () { return this.cart.apply(this, arguments); };
Coordinate.prototype.cart = function (options) {
    var temp;
    options = options || {};
    switch (this.initialType) {
        case 'cart2d':
            return this.pos.cart2d;
        case 'cart3d':
            return this.pos.cart3d;
        case 'polar':
            this.pos.cart2d = Coordinate.polarToCart2d(this.pos.polar, this.isDegree);
            return this.pos.cart2d;
        case 'cylindrical':
            temp = Coordinate.polarToCart2d(this.pos.polar, this.isDegree);
            this.pos.cart3d = [temp[0], temp[1], this.pos.cylindrical[2]];
            return this.pos.cart3d;
        case 'spherical':
            this.pos.cart3d = Coordinate.sphericalToCart3d(this.pos.spherical, this.isDegree);
            return this.pos.cart3d;
        default:
            throw new Error('cannot convert to/from original/requested types');
    }
};



/*
 * Converts current coordinate to cylindrical
 * @param  {Object} options
 * @return {Array}  coordinates in respective coordinate format
 */
Coordinate.prototype.cylindrical = function () { return this.cyl.apply(this, arguments); };
Coordinate.prototype.cyl = function (options) {
    var temp;
    options = options || {};
    switch (this.initialType) {
        case 'cart2d':
            temp = Coordinate.cart2dToPolar(this.pos.cart2d, this.isDegree, options.center);
            this.pos.cylindrical = [temp[0], temp[1], 0];
            return this.pos.cylindrical;
        case 'cart3d':
            this.pos.cylindrical = Coordinate.cart3dToCylindrical(this.pos.cart3d, this.isDegree, options.center);
            return this.pos.cylindrical;
        case 'polar':
            temp = this.pos.polar;
            return [temp[0], temp[1], 0];
        case 'cylindrical':
            return this.pos.cylindrical;
        case 'spherical':
            this.pos.cylindrical = Coordinate.sphToCylindrical(this.pos.spherical, this.isDegree);
            return this.pos.cylindrical;
        default:
            throw new Error('cannot convert to/from original/requested types');
    }
};

/*
 * Converts current coordinate to polar
 * @param  {Object} options
 * @return {Array}  coordinates in respective coordinate format
 */
Coordinate.prototype.pol = function () { return this.polar.apply(this, arguments); };
Coordinate.prototype.polar = function (options) {
    options = options || {};
    switch (this.initialType) {
        case 'cart2d':
            this.pos.polar = Coordinate.cart2dToPolar(this.pos.cart2d, this.isDegree, options.center);
            return this.pos.polar;
        case 'polar':
            return this.pos.polar;
        default:
            throw new Error('cannot convert to/from original/requested types');
    }
};



/*
 * Converts current coordinate to spherical
 * @param  {Object} options
 * @return {Array}  coordinates in respective coordinate format
 */
Coordinate.prototype.spherical = function () { return this.sph.apply(this, arguments); };
Coordinate.prototype.sph = function (options) {
    var temp;
    options = options || {};
    switch (this.initialType) {
        case 'cart2d':
            temp = Coordinate.cart2dToPolar(this.pos.cart2d, this.isDegree, options.center);
            this.pos.spherical = [temp[0], temp[1], 0];
            return this.pos.spherical;
        case 'cart3d':
            this.pos.spherical = Coordinate.cart3dToSpherical(this.pos.cart3d, this.isDegree, options.center);
            return this.pos.spherical;
        case 'polar':
            temp = this.pos.polar;
            return [temp[0], temp[1], 0];
        case 'cylindrical':
            this.pos.spherical = Coordinate.cylToSpherical(this.pos.cylindrical, this.isDegree);
            return this.pos.spherical;
        case 'spherical':
            return this.pos.spherical;
        default:
            throw new Error('cannot convert to/from original/requested types');
    }
};


///
/// Static Conversion Functions
///

/**
 * @description Generates an initially cartesian coordinate object
 * @param  {Object} coordinates
 * @return {Coordinate}
 */
Coordinate.cartesian = function(x) { return Coordinate.cart(x); };
Coordinate.cart = function(options) {
    var baseCoord;
    if (isArray(options)) {
        options = {coords: options};
    }
    if (isObject(options) && isArray(options.coords)) {
        Coordinate.arrToNumeric(options.coords);
        if (options.coords.length < 2 || options.coords.length > 3) {
            throw new Error('expected exactly 2 or exactly 3 cartesian options');
        }
        baseCoord = {
            label: 'cart2d',
            options: options.coords
        };
        baseCoord = extend(baseCoord, options);
        if (options.coords.length === 2) {
            return new Coordinate(baseCoord);
        }
        baseCoord.label = 'cart3d';
        return new Coordinate(baseCoord);
    }
    throw new Error('expected options w/ array of [x,y,(z?)] coords');
};



/**
 * @description Point in [r (radius), t (theta), z]
 * @param  {Object} coordinates
 * @return {Coordinate}
 */
Coordinate.cylindrical = function(x) { return Coordinate.cyl(x); };
Coordinate.cyl = function(options) {
    var baseCoord;
    if (isArray(options)) {
        options = {coords: options};
    }
    if (isObject(options) && isArray(options.coords)) {
        Coordinate.arrToNumeric(options.coords);
        if (options.coords.length !== 3) {
            throw new Error('expected exactly 3 params [r, t, z]');
        }
        baseCoord = {
            label: 'cylindrical',
            coords: options.coords
        };
        baseCoord = extend(baseCoord, options);
        return new Coordinate(baseCoord);
    }
    throw new Error('expected options w/ array of [r, t, z] coords');
};



/**
 * @description Point in [r (radius), t (theta)]
 * @param  {Object} coordinates
 * @return {Coordinate}
 */
Coordinate.polar = function(x) { return Coordinate.pol(x); };
Coordinate.pol = function(options) {
    var baseCoord;
    if (isArray(options)) {
        options = {coords: options};
    }
    if (isObject(options) && isArray(options.coords)) {
        Coordinate.arrToNumeric(options.coords);
        if (options.coords.length !== 2) {
            throw new Error('expected exactly 2 params [r, t]');
        }
        baseCoord = {
            label: 'polar',
            coords: options.coords
        };
        baseCoord = extend(baseCoord, options);
        return new Coordinate(baseCoord);
    }
    throw new Error('expected array of [r, t] options');
};



/**
 * @description Point in [r (radius), t (theta), p (phi)]
 * @param  {Object} coordinates
 * @return {Coordinate}
 */
Coordinate.spherical = function(x) { return Coordinate.sph(x); };
Coordinate.sph = function(options) {
    var baseCoord;
    if (isArray(options)) {
        options = {coords: options};
    }
    if (isObject(options) && isArray(options.coords)) {
        Coordinate.arrToNumeric(options.coords);
        if (options.coords.length !== 3) {
            throw new Error('expected exactly 3 params [r, t, p]');
        }
        baseCoord = {
            label: 'spherical',
            coords: options.coords
        };
        baseCoord = extend(baseCoord, options);
        return new Coordinate(baseCoord);
    }
    throw new Error('expected options w/ array of [r, t, p] coords');
};



/**
 * Mutates an array of number-like looking values,
 * e.g. strings/nums [5, '2.4', '0'], to purely numeric
 * @param  {Array} nums
 * @return {undefined}
 */
Coordinate.arrToNumeric = function(nums) {
    var num;
    if (!isArray(nums)) {
        throw new TypeError("expected array of number-like values");
    }
    for (var i = nums.length - 1; i >= 0; i--) {
        num = nums[i];
        if (typeof num === 'string') {
            num = parseFloat(num);
        }
        if (!isNumber(num)) {
            throw new TypeError(num + ' not numeric');
        }
    }
};



/**
 * Converts polar coordinates to 2d cartesian coords
 * @param  {Array}  rt        [radis, theta]
 * @param  {Boolean} isDegree specifies units
 * @return {Array}            [x, y]
 */
Coordinate.polarToCart2d = function(rt, isDegree) {
    var r, t, x, y;
    r = rt[0];
    t = rt[1];
    if (isDegree) {
        t = t * (1/degPerRadian);
    }
    x = r * Math.cos(t);
    y = r * Math.sin(t);
    return [x, y];
};



/**
 * Convert xy coordinates to colar
 * @param  {Array}  xy
 * @param {Boolean=} isDegree overrides default radian theta assumption
 * @param  {Array=} center [x, y] coords of center of circle
 * @return {Array}  rt
 */
Coordinate.cart2dToPolar = function(xy, isDegree, center) {
    var x, y, r, t;
    if (!isArray(xy) && xy.length !== 2) {
        throw new TypeError('expected [x, y] xy array');
    }
    x = xy[0];
    y = xy[1];
    if (center && !isArray(center) && center.length !== 2) {
        throw new TypeError('expected [x, y] center array');
    }
    if (center) {
        x = x - center[0];
        y = y - center[1];
    }
    r = Math.sqrt(x*x + y*y);
    t = Math.atan2(y, x);
    if (isDegree) {
        t = t * degPerRadian;
    }
    return [r, t];
};


///
/// Static Contstructor Functions
///

/**
 * Converts 3d cartesian to 3d cylindrical
 * @param  {Array}      argument [x, y, z] coords
 * @param  {Boolean=}   isDegree overrides default radian theta assumption
 * @param  {Array=}     center [x, y] coords of center of circle
 * @return {Array}          [r, t, z] coords
 */
Coordinate.cart3dToCylindrical = function (xyz, isDegree, center) {
    var x = xyz[0],
        y = xyz[1],
        z = xyz[2],
        rt;
    rt = Coordinate.cart2dToPolar([x, y], isDegree, center);
    return [rt[0], rt[1], z];
};




/**
 * Converts 3d cartesian to 3d spherical coords
 * @param  {Array}      argument [x, y, z] coords
 * @param  {Boolean=}   isDegree overrides default radian theta assumption
 * @param  {Array=}     center [x, y, z] coords of center of circle
 * @return {Array}          [r, t, p] coords
 */
Coordinate.cart3dToSpherical = function (xyz, isDegree, center) {
    if (center && center.length !== 3) {
        throw new Error('expected center value to have [x, y, z] coords' +
            'for locating sphere center');
    }
    var x = xyz[0],
        y = xyz[1],
        z = xyz[2],
        x2, y2, z2,
        r, t, p;
    if (center) {
        x = x - center[0];
        y = y - center[1];
        z = z - center[2];
    }
    x2 = x*x; y2 = y*y; z2 = z*z;
    r = Math.sqrt(x2 + y2 + z2);
    if (!r) {
        p = t = 0;
    } else {
        t = Math.atan2(y,x);
        p = Math.atan2(Math.sqrt(x2 + y2), z);
        if (isDegree) {
            t = t * degPerRadian;
            p = p * degPerRadian;
        }
    }
    return [r, t, p];
};



/**
 * Converts a cylindrical (r, t, z) point to a spherical (r, t, p) point
 * @param  {Array}  rtz
 * @param  {Boolean} isDegree
 * @return {Array}
 */
Coordinate.cylToSpherical =function(rtz, isDegree) {
    var r = rtz[0], t = rtz[1], z = rtz[2];
    var sr, sp; // sphere radius, sphere theta...
    if (isDegree) {
        t = t / degPerRadian;
    }
    sr = Math.sqrt(r*r + z*z);
    sp = Math.atan2(r, z);
    if (isDegree) {
        sp = sp * degPerRadian;
        t = t * degPerRadian;
    }
    return [sr, t, sp];
};



/**
 * Converts a spherical (r, t, p) point to a cartesian (x, y, z) point
 * @param  {Array}  rtz
 * @param  {Boolean} isDegree
 * @return {Array}
 */
Coordinate.sphericalToCart3d = function (rtp, isDegree) {
    var r = rtp[0], t = rtp[1], p = rtp[2],
        x,y,z;
    if (isDegree) {
        t = t / degPerRadian;
        p = p / degPerRadian;
    }
    x = r * Math.sin(p) * Math.cos(t);
    y = r * Math.sin(p) * Math.sin(t);
    z = r * Math.cos(p);
    return [x, y, z];
};



/**
 * Converts a spherical (r, t, p) point to a cylindrical (r, t, z) point
 * @param  {Array}  rtz
 * @param  {Boolean} isDegree
 * @return {Array}
 */
Coordinate.sphToCylindrical = function (rtp, isDegree) {
    var r = rtp[0], t = rtp[1], p = rtp[2],
        cr, z;
    if (isDegree) {
        t = t / degPerRadian;
        p = p / degPerRadian;
    }
    cr = r * Math.sin(p);
    z = r * Math.cos(p);
    if (isDegree) {
        t = t * degPerRadian;
        p = p * degPerRadian;
    }
    return [cr, t, z];
};

module.exports = Coordinate;
