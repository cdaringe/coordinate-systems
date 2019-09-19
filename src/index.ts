import { isArray } from 'lodash'

export enum CoordinateType {
  CARTESIAN_2D = 'CARTESIAN_2D',
  CARTESIAN_3D = 'CARTESIAN_3D',
  CYLINDRICAL = 'CYLINDRICAL',
  POLAR = 'POLAR',
  SPHERICAL = 'SPHERICAL'
}

export type DoubleNumArray = [number, number]
export type TripleNumArray = [number, number, number]

export type Cartesian2dCoordinateTuple = DoubleNumArray
export type Cartesian3dCoordinateTuple = TripleNumArray
export type CartesianTuple =
  | Cartesian2dCoordinateTuple
  | Cartesian3dCoordinateTuple
export type CylindricalCoordinateTuple = TripleNumArray
export type PolarCoordinateTuple = DoubleNumArray
export type SphericalCoordinateTuple = TripleNumArray

export type CoordinateTuple =
  | Cartesian2dCoordinateTuple
  | Cartesian3dCoordinateTuple
  | CylindricalCoordinateTuple
  | PolarCoordinateTuple
  | SphericalCoordinateTuple

const degPerRadian = 180 / Math.PI

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
export class Coordinate {
  public isRadian: boolean = true
  public isDegree: boolean = false
  public type: CoordinateType
  public coordinates: CoordinateTuple
  private cooridnatesByType: {
    [CoordinateType.CARTESIAN_2D]?: Cartesian2dCoordinateTuple
    [CoordinateType.CARTESIAN_3D]?: Cartesian3dCoordinateTuple
    [CoordinateType.CYLINDRICAL]?: CylindricalCoordinateTuple
    [CoordinateType.POLAR]?: PolarCoordinateTuple
    [CoordinateType.SPHERICAL]?: SphericalCoordinateTuple
  } = {}

  //
  // Static Constructor Functions
  //

  /**
   * Create a point provided x, y, and optionally z coordinates
   * @param  {Object} coordinates
   * @return {Coordinate}
   */
  static cartesian (coordinates: CartesianTuple) {
    if (coordinates.length === 2) {
      return new Coordinate({
        coordinates,
        type: CoordinateType.CARTESIAN_2D
      })
    }
    if (coordinates.length === 3) {
      return new Coordinate({
        coordinates,
        type: CoordinateType.CARTESIAN_3D
      })
    }
    throw new Error('coordinates should have length 2 or 3')
  }

  static cylindrical (coordinates: CylindricalCoordinateTuple) {
    if (coordinates.length !== 3) {
      throw new Error('expected exactly 3 params [r, t, z]')
    }
    return new Coordinate({
      coordinates,
      type: CoordinateType.CYLINDRICAL
    })
  }

  static polar (coordinates: PolarCoordinateTuple) {
    if (coordinates.length !== 2) {
      throw new Error('expected exactly 2 params [r, t]')
    }
    return new Coordinate({
      coordinates,
      type: CoordinateType.POLAR
    })
  }

  static spherical (coordinates: SphericalCoordinateTuple) {
    if (coordinates.length !== 3) {
      throw new Error('expected exactly 3 params [r, t, p]')
    }
    return new Coordinate({
      coordinates,
      type: CoordinateType.SPHERICAL
    })
  }

  //
  // STATIC Converters
  //

  /**
   * Convert a cylindrical to a spherical coordinates
   * @param  {Array}   rtz
   * @param  {Boolean} isDegree
   * @return {Array}   [radius, theta, phi]
   */
  static cylindricalToSpherical ({
    coordinate,
    isDegree
  }: {
    coordinate: CylindricalCoordinateTuple
    isDegree: boolean
  }): TripleNumArray {
    const rtz = coordinate
    var r = rtz[0]
    var t = rtz[1]
    var z = rtz[2]
    var sr, sp // sphere radius, sphere theta...
    if (isDegree) {
      t = t / degPerRadian
    }
    sr = Math.sqrt(r * r + z * z)
    sp = Math.atan2(r, z)
    if (isDegree) {
      sp = sp * degPerRadian
      t = t * degPerRadian
    }
    return [sr, t, sp]
  }

  /**
   * Convert polar to 2d cartesian coordinates
   * @param  {Array}   rt        [radis, theta]
   * @param  {Boolean} isDegree specifies units
   * @return {Array}  [x, y]
   */
  static polarToCart2d ({
    coordinate,
    isDegree
  }: {
    coordinate: PolarCoordinateTuple
    isDegree?: boolean
  }): [number, number] {
    var r, t, x, y
    r = coordinate[0]
    t = coordinate[1]
    if (isDegree) {
      t = t * (1 / degPerRadian)
    }
    x = r * Math.cos(t)
    y = r * Math.sin(t)
    return [x, y]
  }

  /**
   * Convert 3d cartesian to 3d cylindrical coordinates
   * @param  {Array}      argument [x, y, z] coords
   * @param  {Boolean=}   isDegree overrides default radian theta assumption
   * @param  {Array=}     center [x, y] coords of center of circle
   * @return {Array}      [radius, theta, z]
   */
  static cartesian3dToCylindrical ({
    coordinate,
    isDegree,
    center
  }: {
    coordinate: TripleNumArray
    isDegree?: boolean
    center?: TripleNumArray
  }): TripleNumArray {
    const xyz = coordinate
    var x = xyz[0]
    var y = xyz[1]
    var z = xyz[2]
    var rt
    rt = Coordinate.cartesian2dToPolar({
      coordinate: [x, y],
      isDegree,
      center: center ? [center[0], center[1]] : undefined
    })
    return [rt[0], rt[1], z]
  }

  static sphericalToCart3d ({
    coordinate,
    isDegree
  }: {
    coordinate: SphericalCoordinateTuple
    isDegree?: boolean
  }): [number, number, number] {
    var r = coordinate[0]
    var t = coordinate[1]
    var p = coordinate[2]
    var x
    var y
    var z
    if (isDegree) {
      t = t / degPerRadian
      p = p / degPerRadian
    }
    x = r * Math.sin(p) * Math.cos(t)
    y = r * Math.sin(p) * Math.sin(t)
    z = r * Math.cos(p)
    return [x, y, z]
  }

  /**
   * Convert spherical to cylindrical coordinates
   */
  static sphericalToCylindrical ({
    coordinate,
    isDegree
  }: {
    coordinate: SphericalCoordinateTuple
    isDegree?: boolean
  }): TripleNumArray {
    const rtp = coordinate
    var r = rtp[0]
    var t = rtp[1]
    var p = rtp[2]
    var cr
    var z
    if (isDegree) {
      t = t / degPerRadian
      p = p / degPerRadian
    }
    cr = r * Math.sin(p)
    z = r * Math.cos(p)
    if (isDegree) {
      t = t * degPerRadian
      p = p * degPerRadian
    }
    return [cr, t, z]
  }

  /**
   * Convert 3d cartesian to 3d spherical coordinates
   * @param  {Array}      argument [x, y, z] coords
   * @param  {Boolean=}   isDegree overrides default radian theta assumption
   * @param  {Array=}     center [x, y, z] coords of center of circle
   * @return {Array}      [radius, theta, phi]
   */
  static cartesian3dToSpherical ({
    coordinate,
    isDegree,
    center
  }: {
    coordinate: Cartesian3dCoordinateTuple
    isDegree?: boolean
    center?: TripleNumArray
  }): TripleNumArray {
    const xyz = coordinate
    if (center && center.length !== 3) {
      throw new Error(
        'expected center value to have [x, y, z] coords' +
          'for locating sphere center'
      )
    }
    var [x, y, z] = xyz
    var x2
    var y2
    var z2
    var r
    var t
    var p
    if (center) {
      x = x - center[0]
      y = y - center[1]
      z = z - center[2]
    }
    x2 = x * x
    y2 = y * y
    z2 = z * z
    r = Math.sqrt(x2 + y2 + z2)
    if (!r) {
      p = t = 0
    } else {
      t = Math.atan2(y, x)
      p = Math.atan2(Math.sqrt(x2 + y2), z)
      if (isDegree) {
        t = t * degPerRadian
        p = p * degPerRadian
      }
    }
    return [r, t, p]
  }

  /**
   * Convert cartesian 2d to polar coordinates
   * @param  {Array=} center [x, y] coords of center of circle.  Defaults to [0, 0],
   * however may be offset.
   * @return {Array}  [radius, theta]
   */
  static cartesian2dToPolar ({
    coordinate,
    isDegree,
    center
  }: {
    coordinate: CartesianTuple
    isDegree?: boolean
    center?: CartesianTuple
  }): DoubleNumArray {
    const xy = coordinate
    var x, y, r, t
    if (!isArray(xy) || xy.length !== 2) {
      throw new TypeError('coorinate must be an [x, y, ...] array')
    }
    x = xy[0]
    y = xy[1]
    if (center && (!isArray(center) || center.length !== 2)) {
      throw new TypeError('expected [x, y] center array')
    }
    if (center) {
      x = x - center[0]
      y = y - center[1]
    }
    r = Math.sqrt(x * x + y * y)
    t = Math.atan2(y, x)
    if (isDegree) t = t * degPerRadian
    return [r, t]
  }

  constructor ({
    coordinates,
    isDegree,
    isRadian,
    type
  }: {
    coordinates?: CoordinateTuple
    isDegree?: boolean
    isRadian?: boolean
    type: CoordinateType
  }) {
    if (isDegree) {
      this.isDegree = true
      this.isRadian = false
    }
    if (!type) throw new Error('no type coordinate type defined')
    if (!coordinates) throw new Error('no coordinates provided')
    this.type = type
    this.coordinates = coordinates
    this.cooridnatesByType[type] = this.coordinates as any
  }

  cartesian (): CartesianTuple {
    switch (this.type) {
      case CoordinateType.CARTESIAN_2D:
        return this.cooridnatesByType[CoordinateType.CARTESIAN_2D]!
      case CoordinateType.CARTESIAN_3D:
        return this.cooridnatesByType[CoordinateType.CARTESIAN_3D]!
      case CoordinateType.POLAR:
        this.cooridnatesByType[
          CoordinateType.CARTESIAN_2D
        ] = Coordinate.polarToCart2d({
          coordinate: this.cooridnatesByType[CoordinateType.POLAR]!,
          isDegree: this.isDegree
        })
        return this.cooridnatesByType[CoordinateType.CARTESIAN_2D]!
      case CoordinateType.CYLINDRICAL:
        var [r, t] = this.cooridnatesByType[CoordinateType.CYLINDRICAL]!
        var temp = Coordinate.polarToCart2d({
          coordinate: [r, t],
          isDegree: this.isDegree
        })
        this.cooridnatesByType[CoordinateType.CARTESIAN_3D] = [
          temp[0],
          temp[1],
          this.coordinates[2]!
        ]
        return this.cooridnatesByType[CoordinateType.CARTESIAN_3D]!
      case CoordinateType.SPHERICAL:
        this.cooridnatesByType[
          CoordinateType.CARTESIAN_3D
        ] = Coordinate.sphericalToCart3d({
          coordinate: this.cooridnatesByType[CoordinateType.SPHERICAL]!,
          isDegree: this.isDegree
        })
        return this.cooridnatesByType[CoordinateType.CARTESIAN_3D]!
      default:
        throw new Error(`cannot convert from ${this.type} to cartesian`)
    }
  }

  cylindrical (options?: {
    center?: DoubleNumArray | TripleNumArray
  }): CylindricalCoordinateTuple {
    var temp
    options = options || {}
    const center: TripleNumArray | undefined = options.center
      ? [options.center[0], options.center[1], options.center[2] || 0]
      : undefined
    switch (this.type) {
      case CoordinateType.CARTESIAN_2D:
        temp = Coordinate.cartesian2dToPolar({
          coordinate: this.cooridnatesByType.CARTESIAN_2D!,
          isDegree: this.isDegree,
          center
        })
        this.cooridnatesByType.CYLINDRICAL = [temp[0], temp[1], 0]
        return this.cooridnatesByType.CYLINDRICAL
      case CoordinateType.CARTESIAN_3D:
        this.cooridnatesByType.CYLINDRICAL = Coordinate.cartesian3dToCylindrical(
          {
            coordinate: this.cooridnatesByType[CoordinateType.CARTESIAN_3D]!,
            isDegree: this.isDegree,
            center
          }
        )
        return this.cooridnatesByType.CYLINDRICAL
      case CoordinateType.POLAR:
        temp = this.cooridnatesByType.POLAR
        return [temp![0], temp![1], 0]
      case CoordinateType.CYLINDRICAL:
        return this.cooridnatesByType.CYLINDRICAL! // identity
      case CoordinateType.SPHERICAL:
        this.cooridnatesByType.CYLINDRICAL = Coordinate.sphericalToCylindrical({
          coordinate: this.cooridnatesByType.SPHERICAL!,
          isDegree: this.isDegree
        })
        return this.cooridnatesByType.CYLINDRICAL
      default:
        throw new Error(`cannot convert ${this.type} to cylindrical`)
    }
  }

  polar (options?: { center?: DoubleNumArray }): PolarCoordinateTuple {
    options = options || {}
    switch (this.type) {
      case CoordinateType.CARTESIAN_2D:
        this.cooridnatesByType.POLAR = Coordinate.cartesian2dToPolar({
          coordinate: this.cooridnatesByType.CARTESIAN_2D!,
          isDegree: this.isDegree,
          center: options.center
        })
        return this.cooridnatesByType.POLAR
      case CoordinateType.CARTESIAN_3D:
        this.cooridnatesByType.POLAR = Coordinate.cartesian2dToPolar({
          coordinate: this.cooridnatesByType.CARTESIAN_3D!,
          isDegree: this.isDegree,
          center: options.center
        })
        return this.cooridnatesByType.POLAR
      case CoordinateType.POLAR:
        return this.cooridnatesByType.POLAR!
      default:
        throw new Error('cannot convert to/from original/requested types')
    }
  }

  /**
   * Converts current coordinate to spherical
   * @param  {Object} options
   * @return {Array}  coordinates in respective coordinate format
   */
  spherical (options?: { center?: TripleNumArray }): SphericalCoordinateTuple {
    var temp
    options = options || {}
    switch (this.type) {
      case CoordinateType.CARTESIAN_2D:
        temp = Coordinate.cartesian2dToPolar({
          coordinate: this.cooridnatesByType.CARTESIAN_2D!,
          isDegree: this.isDegree,
          center: options.center
        })
        this.cooridnatesByType.SPHERICAL = [temp[0], temp[1], 0]
        return this.cooridnatesByType.SPHERICAL
      case CoordinateType.CARTESIAN_3D:
        this.cooridnatesByType.SPHERICAL = Coordinate.cartesian3dToSpherical({
          coordinate: this.cooridnatesByType.CARTESIAN_3D!,
          isDegree: this.isDegree,
          center: options.center
        })
        return this.cooridnatesByType.SPHERICAL
      case CoordinateType.POLAR:
        temp = this.cooridnatesByType.POLAR!
        return [temp[0], temp[1], 0]
      case CoordinateType.CYLINDRICAL:
        this.cooridnatesByType.SPHERICAL = Coordinate.cylindricalToSpherical({
          coordinate: this.cooridnatesByType.CYLINDRICAL!,
          isDegree: this.isDegree
        })
        return this.cooridnatesByType.SPHERICAL
      case CoordinateType.SPHERICAL:
        return this.cooridnatesByType.SPHERICAL!
      default:
        throw new Error('cannot convert to/from original/requested types')
    }
  }
}
