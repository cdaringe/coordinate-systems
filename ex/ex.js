var CS = require('../coordinate-systems');

xy = CS.cart([0, 5]); // 2d cartesian
xyz = CS.cart([1, 2, 3]); // 3d cartesian

console.dir(xy.polar());
console.dir(xyz.spherical());

xy2 = CS.cart({
    coords: [0, 5],
    isDegree: true
});
console.dir(xy2.polar());
