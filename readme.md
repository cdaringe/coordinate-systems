# coordinate-systems

<img src="https://raw.githubusercontent.com/cdaringe/coordinate-systems/master/img/logo.png" height="150" width="165" >

convert between common 2d and 3d coordinate systems:

1. cartesian (2d)
2. cartesian (3d)
3. polar (2d)
4. cylindrical (3d)
5. spherical (3d)

# install

`npm install --save coordinate-systems`

# usage

construct a `Coordinate` using one of the provided static constructor functions.
Run the conversion member function to convert to an array of values in `[x, y, z?]/[r, t, p?/z?]` format.

```ts
import { Coordinate, CoordinateType } from 'coordinate-systems'

// static, short-hand contructors
// @note, radians assumed by default for polar-esque systems
const xy = Coordinate.cartesian([0, 5])
const xyz = Coordinate.cartesian([1, 2, 3])
Coordinate.polar([2, Math.PI / 4])
Coordinate.cartesian([0.5, 0.5, 0.707])
Coordinate.cylindrical([2, Math.PI / 4, 5])
Coordinate.spherical([5, (60 * Math.PI) / 180, (30 * Math.PI) / 180])

// classic constructor
new Coordinate({ coordinates: [3, 4, 5], isDegree: true, type: CoordinateType.CARTESIAN_3D })
new Coordinate({ coordinates: [3, 60, 4], isDegree: true, type: CoordinateType.CYLINDRICAL })
new Coordinate({ coordinates: [5, 60, 30], type: CoordinateType.SPHERICAL })

xy.polar() // [ 5, 1.5707963267948966 ] (i.e. radius 5, theta π/2 radians)
xyz.spherical() // [ 3.74..., 1.10..., 0.64... ] (radius, theta, phi)
```

because this is a typescript package, the interfaces are fully documented and can be seen in [src/index.d.ts](./src/index.d.ts).  this is usually not a tracked file, but tracked here strictly for documentation purposes.
