export declare enum CoordinateType {
  CARTESIAN_2D = 'CARTESIAN_2D',
  CARTESIAN_3D = 'CARTESIAN_3D',
  CYLINDRICAL = 'CYLINDRICAL',
  POLAR = 'POLAR',
  SPHERICAL = 'SPHERICAL'
}
export declare type DoubleNumArray = [number, number]
export declare type TripleNumArray = [number, number, number]
export declare type Cartesian2dCoordinateTuple = DoubleNumArray
export declare type Cartesian3dCoordinateTuple = TripleNumArray
export declare type CartesianTuple =
  | Cartesian2dCoordinateTuple
  | Cartesian3dCoordinateTuple
export declare type CylindricalCoordinateTuple = TripleNumArray
export declare type PolarCoordinateTuple = DoubleNumArray
export declare type SphericalCoordinateTuple = TripleNumArray
export declare type CoordinateTuple =
  | Cartesian2dCoordinateTuple
  | Cartesian3dCoordinateTuple
  | CylindricalCoordinateTuple
  | PolarCoordinateTuple
  | SphericalCoordinateTuple
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
export declare class Coordinate {
  isRadian: boolean
  isDegree: boolean
  type: CoordinateType
  coordinates: CoordinateTuple
  private cooridnatesByType
  /**
   * Create a point provided x, y, and optionally z coordinates
   * @param  {Object} coordinates
   * @return {Coordinate}
   */
  static cartesian (coordinates: CartesianTuple): Coordinate
  static cylindrical (coordinates: CylindricalCoordinateTuple): Coordinate
  static polar (coordinates: PolarCoordinateTuple): Coordinate
  static spherical (coordinates: SphericalCoordinateTuple): Coordinate
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
  }): TripleNumArray
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
  }): [number, number]
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
  }): TripleNumArray
  static sphericalToCart3d ({
    coordinate,
    isDegree
  }: {
    coordinate: SphericalCoordinateTuple
    isDegree?: boolean
  }): [number, number, number]
  /**
   * Convert spherical to cylindrical coordinates
   */
  static sphericalToCylindrical ({
    coordinate,
    isDegree
  }: {
    coordinate: SphericalCoordinateTuple
    isDegree?: boolean
  }): TripleNumArray
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
  }): TripleNumArray
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
  }): DoubleNumArray
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
  })
  cartesian (): CartesianTuple
  cylindrical (options?: {
    center?: DoubleNumArray | TripleNumArray
  }): CylindricalCoordinateTuple
  polar (options?: { center?: DoubleNumArray }): PolarCoordinateTuple
  /**
   * Converts current coordinate to spherical
   * @param  {Object} options
   * @return {Array}  coordinates in respective coordinate format
   */
  spherical (options?: { center?: TripleNumArray }): SphericalCoordinateTuple
}
