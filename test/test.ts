import ava, { TestInterface } from 'ava'
import { Coordinate, CoordinateType } from '../src/index'

const test = ava as TestInterface<{
  cs: Coordinate
  cspolar: Coordinate
  cspolar2: Coordinate
  csCart3d: Coordinate
  cart: Coordinate
  csCart3d3: Coordinate
  csCyl: Coordinate
  csCyl2: Coordinate
  csSph: Coordinate
  csSph2: Coordinate
}>

function isApproximatelyEqual (a: number, b: number) {
  return Math.abs(Math.round(a * 1000) - Math.round(b * 1000)) < 0.001
}

test.beforeEach(function (t) {
  t.context = {
    cs: Coordinate.cartesian([0, 5]),
    cspolar: Coordinate.polar([2, Math.PI / 2]),
    cspolar2: Coordinate.polar([2, Math.PI / 4]),
    csCart3d: Coordinate.cartesian([1, 1, 1]),
    cart: Coordinate.cartesian([0.5, 0.5, 0.707]),
    csCart3d3: new Coordinate({
      coordinates: [3, 4, 5],
      isDegree: true,
      type: CoordinateType.CARTESIAN_3D
    }),
    csCyl: Coordinate.cylindrical([2, Math.PI / 4, 5]),
    csCyl2: new Coordinate({
      coordinates: [3, 60, 4],
      isDegree: true,
      type: CoordinateType.CYLINDRICAL
    }),
    csSph: Coordinate.spherical([
      5,
      (60 * Math.PI) / 180,
      (30 * Math.PI) / 180
    ]),
    csSph2: new Coordinate({
      coordinates: [5, 60, 30],
      isDegree: true,
      type: CoordinateType.SPHERICAL
    })
  }
})

test('should always have a single theta mode', function (t) {
  const { cs } = t.context
  t.is(cs.isRadian, true)
  t.is(cs.isDegree, false)
})

test('should be built from static-like coord-type function', function (t) {
  t.throws(() => new Coordinate({} as any))
  var cs = new Coordinate({
    type: CoordinateType.CARTESIAN_2D,
    coordinates: [0, 0]
  })
  t.assert(cs)
})

test('cartsian 2d // should convert to cartesian', function (t) {
  const { cs } = t.context
  var cartCoords = cs.cartesian()
  t.is(cartCoords.length, 2)
  t.is(cartCoords[1], 5)
})

test('cartsian 2d // should convert to polar', function (t) {
  const { cs } = t.context
  t.is(cs.polar().length, 2)
  t.is(cs.polar()[0], 5)
  t.is(Math.round(cs.polar()[1] * 1000), Math.round((Math.PI / 2) * 1000))
})

test('cartsian 2d // should convert to cylindrical', function (t) {
  const { cs } = t.context
  var c = cs.cylindrical()
  t.is(c.length, 3)
  t.is(c[0], 5)
  t.is(c[2], 0)
})

test('cartsian 2d //should convert to spherical', function (t) {
  const { cs } = t.context
  var c = cs.spherical()
  t.is(c.length, 3)
  t.is(c[0], 5)
  t.is(c[2], 0)
})

test('polar // should convert to cartesian', function (t) {
  const { cspolar, cspolar2 } = t.context
  t.is(cspolar.cartesian().length, 2)
  t.is(cspolar.cartesian()[1], 2)
  t.is(
    Math.round(cspolar2.cartesian()[1] * 1000),
    Math.round(2 * Math.sin(Math.PI / 4) * 1000)
  )
})

test('polar // should convert to polar', function (t) {
  const { cspolar } = t.context
  t.is(cspolar.polar().length, 2)
  t.is(cspolar.polar()[1], Math.PI / 2)
})

test('polar // should convert to cylindrical', function (t) {
  const { cspolar } = t.context
  t.is(cspolar.cylindrical()[2], 0)
})

test('polar // should convert to spherical', function (t) {
  const { cspolar } = t.context
  t.is(cspolar.spherical()[2], 0)
})

test('cart3d // should convert to cylindrical', function (t) {
  const { csCart3d } = t.context
  var rtz = csCart3d.cylindrical()
  var r = rtz[0]
  var theta = rtz[1]
  var z = rtz[2]
  t.true(isApproximatelyEqual(r, Math.sqrt(2)))
  t.true(isApproximatelyEqual(theta, Math.PI / 4))
  t.true(isApproximatelyEqual(z, 1))
})

test('cart3d // should convert to spherical', function (_t) {
  const { csCart3d3 } = _t.context
  var rtp = csCart3d3.spherical()
  var r = rtp[0]
  var t = rtp[1]
  var p = rtp[2]
  _t.true(isApproximatelyEqual(r, 7.07106))
  _t.true(isApproximatelyEqual(t, 53.13))
  _t.true(isApproximatelyEqual(p, 45.0))
})
test('cart3d // should convert to cart3d', function (t) {
  const { csCart3d3 } = t.context
  var [x, y, z] = csCart3d3.cartesian()
  t.is(x, 3)
  t.is(y, 4)
  t.is(z, 5)
})
test('cart3d // should error converting to polar', function (t) {
  const { csCart3d3 } = t.context
  t.throws(() => csCart3d3.polar())
})

test('cylindrical // should convert to cylindrical', function (t) {
  const { csCyl } = t.context
  var rtz = csCyl.cylindrical()
  var r = rtz[0]
  var theta = rtz[1]
  var z = rtz[2]
  t.is(r, 2)
  t.is(z, 5)
  t.true(isApproximatelyEqual(theta, Math.PI / 4))
})

test('cylindrical // should convert to spherical', function (t) {
  const { csCyl2 } = t.context
  var cylSphere = csCyl2.spherical()
  t.is(cylSphere.length, 3)
  t.true(isApproximatelyEqual(cylSphere[0], 5))
  t.true(isApproximatelyEqual(cylSphere[1], 60))
  t.true(isApproximatelyEqual(cylSphere[2], 36.8698))
})
test('cylindrical // should convert to cart3d', function (t) {
  const { csCyl } = t.context
  var cylCart = csCyl.cartesian()
  t.true(isApproximatelyEqual(cylCart[0], 2 * Math.sin(Math.PI / 4)))
  t.true(isApproximatelyEqual(cylCart[1], 2 * Math.sin(Math.PI / 4)))
  t.true(isApproximatelyEqual(cylCart[2]!, 5))
})

test('spherical // should convert to spherical', function (t) {
  const { csSph, csSph2 } = t.context
  var [r, theta, p] = csSph.spherical()
  t.is(r, 5)
  t.true(isApproximatelyEqual(theta, (60 * Math.PI) / 180))
  t.true(isApproximatelyEqual(p, (30 * Math.PI) / 180))
  ;[r, theta, p] = csSph2.spherical()
  t.is(r, 5)
  t.is(theta, 60)
  t.is(p, 30)
})

test('spherical // should convert to cyclindrical', function (t) {
  const { csSph2 } = t.context
  var [r, theta, z] = csSph2.cylindrical()
  t.true(isApproximatelyEqual(r, 2.5))
  t.true(isApproximatelyEqual(theta, 60))
  t.true(isApproximatelyEqual(z, 4.33))
})

test('spherical // should convert to cart3d', function (t) {
  const { csSph2 } = t.context
  var [x, y, z] = csSph2.cartesian()
  t.true(isApproximatelyEqual(x, 1.25))
  t.true(isApproximatelyEqual(y, 2.165))
  t.true(isApproximatelyEqual(z!, 4.33))
})
