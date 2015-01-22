[ ![Codeship Status for cdaringe/coordinate-systems](https://codeship.com/projects/17a94530-8285-0132-f7da-56a1ab730b01/status?branch=master)](https://codeship.com/projects/57887)

<img src="https://raw.githubusercontent.com/cdaringe/coordinate-systems/master/img/logo.png" height="150" width="165" >
# coordinate-systems
Convert between common 2d and 3d coordinate systems!  Supports:

1. cartesian 2d
1. cartesian 3d
1. polar (2d)
1. cylindrical (3d)
1. spherical (3d)

# Usage
Checkout the API docs for reference (`docs/index.html`).  The code is short and well documented too!  General function availability listed towards bottom.
Generally, construct a Coordinate using one of the provided static constructor functions.
Run the conversion member function to convert to an array of values in [x, y, z?]/[r, t, p?/z?] format.

```js
var Coordinate = require('coordinate-systems');

var xy = Coordinate.cart([0, 5]); // 2d cartesian
var xyz = Coordinate.cart([1, 2, 3]); // 3d cartesian

xy.polar(); // [ 5, 1.5707963267948966 ] (i.e. radius 5, theta π/2 radians)
xyz.spherical(); // [ 3.74..., 1.10..., 0.64... ] (radius, theta, phi)
```

If you want to use degrees, extend the construction function as such:

```js
var xy = Coordinate.cart({
    coords: [0, 5],
    isDegree: true
});

xy.polar(); // [ 5, 90 ] heyo! who uses degrees anyway :)
```

# Summarized Interface
```js
// static constructor functions
// e.g. var myCoord = Coordinate.polar([10, Math.PI/8]);

<static> cart(coordinates) → {Coordinate}
<static> cartesian(coordinates) → {Coordinate}
<static> cyl(coordinates) → {Coordinate}
<static> cylindrical(coordinates) → {Coordinate}
<static> pol(coordinates) → {Coordinate}
<static> polar(coordinates) → {Coordinate}
<static> sph(coordinates) → {Coordinate}
<static> spherical(coordinates) → {Coordinate}

// conversion functions
// e.g. myCoord.cyl(); // renders cylindrical coords, [r, t, z]
.cart()
.cartesian()

.cyl()
.cylindrical()

.pol()
.polar()

.spherical()
.sph()

// under-the-hood conversion functions (no need to use these directly)
<static> cartesian2dToPolar(xy, isDegree, center) → {Array}
<static> cartesian3dToCylindrical(argument, isDegree, center) → {Array}
<static> cartesian3dToSpherical(argument, isDegree, center) → {Array}
<static> cylindricalToSpherical(rtz, isDegree) → {Array}
<static> polarToCart2d(rt, isDegree) → {Array}
<static> sphericalToCart3d(rtz, isDegree) → {Array}
<static> sphericalToCylindrical(rtz, isDegree) → {Array}
```

# Notes
Tests are generated and passing.  These have not run through extensive use cases yet,
so additional testing and feedback is gladly welcomed!
