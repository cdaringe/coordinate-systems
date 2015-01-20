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
Checkout the API docs for reference (`docs/index.html`).  The code is short and well documented too!
Generally, construct a Coordinate using one of the provided static constructor functions.
Run the conversion member function to convert to an array of values in [x, y, z?]/[r, t, p?/z?] format.

```js
var Coordinate = require('coordinate-systems');

xy = Coordinate.cart([0, 5]); // 2d cartesian
xyz = Coordinate.cart([1, 2, 3]); // 3d cartesian

xy.polar(); // [ 5, 1.5707963267948966 ] (i.e. radius 5, theta π/2 radians)
xyz.spherical(); // [ 3.74..., 1.10..., 0.64... ] (radius, theta, phi)
```

* If you want to use degrees, extend the construction function as such:
```js
xy = Coordinate.cart({
    coords: [0, 5],
    isDegree: true
});

xy.polar(); // [ 5, 90 ] heyo! who uses degrees anyway :)
```

# Notes
Tests are generated and passing.  These have not run through extensive use cases yet,
so additional testing and feedback is gladly welcomed!
