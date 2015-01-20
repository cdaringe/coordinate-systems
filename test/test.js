var should = require('should');
var Coordinate = require('../coordinate-systems');
var cs;

beforeEach(function () {
    cs = Coordinate.cart([0, 5]);

    cspolar = Coordinate.pol([2, Math.PI/2]);
    cspolar2 = Coordinate.pol([2, Math.PI/4]);

    csCart3d = Coordinate.cart([1,1,1]);
    csCart3d2 = Coordinate.cart({
        coords: [0.5,0.5,0.707]
    });
    csCart3d3 = Coordinate.cart({
        coords: [3,4,5],
        isDegree: true
    });

    csCyl = Coordinate.cyl([2,Math.PI/4,5]);
    csCyl2 = Coordinate.cyl({
        coords: [3, 60, 4],
        isDegree: true
    });

    csSph = Coordinate.sph([5, 60 * Math.PI/180, 30 * Math.PI/180]);
    csSph2 = Coordinate.sph({
        coords: [5, 60, 30],
        isDegree: true
    });
});
describe('coord intf', function () {
    it('should always have a single theta mode', function () {
        cs.isRadian.should.be.true;
        cs.isDegree.should.be.false;
        cs.isDegree = true;
        cs.isRadian.should.be.false;
        cs.isDegree.should.be.true;
    });

    it('should be built from static-like coord-type function', function () {
        (function() { var csBad = new Coordinate(); }).should.throw;
        (function(){
            var cs = new Coordinate({
                label: 'cart2d',
                coords: {x: 0, y: 0}
            });
        }).should.be.ok;
    });
});

describe('cart2d node', function () {
    it('should accept numeric-ish coords as [x, y]', function () {
        (function(){
            var cs = new Coordinate({
                label: 'cart2d',
                coords: {x: 0, y: '0'}
            });
        }).should.be.ok;
        (function(){
            var cs = new Coordinate({
                label: 'cart2d',
                coords: [0.2, '234.2']
            });
        }).should.be.ok;
        (function(){
            var cs = new Coordinate({
                label: 'cart2d',
                coords: {x: 'b', y: NaN}
            });
        }).should.throw;
    });

    it('should convert to cartesian', function () {
        var cartCoords = cs.cart();
        cartCoords.should.be.an.Array;
        cartCoords.length.should.be.equal(2);
        cartCoords[1].should.be.equal(5);
    });

    it('should convert to polar', function () {
        cs.polar().length.should.be.equal(2);
        cs.polar()[0].should.be.equal(5);
        cs.polar()[1].should.be.approximately(Math.PI/2, 0.001);
    });

    it('should convert to cylindrical', function () {
        var c = cs.cyl();
        c.length.should.be.equal(3);
        c[0].should.be.equal(5);
        c[2].should.be.equal(0);
    });

    it('should convert to spherical', function () {
        var c = cs.sph();
        c.length.should.be.equal(3);
        c[0].should.be.equal(5);
        c[2].should.be.equal(0);
    });
});

describe('polar node', function () {
    it('should convert to cartesian', function () {
        cspolar.cart().should.be.an.Array;
        cspolar.cart().length.should.be.equal(2);
        cspolar.cart()[1].should.be.equal(2);
        cspolar2.cart()[1].should.be.approximately(2*Math.sin(Math.PI/4), 0.001);
    });

    it('should convert to polar', function () {
        cspolar.polar().should.be.an.Array;
        cspolar.polar().length.should.be.equal(2);
        cspolar.polar()[1].should.be.approximately(Math.PI/2, 0.001);
    });

    it('should convert to cylindrical', function () {
        cspolar.cylindrical()[2].should.be.equal(0);
    });

    it('should convert to spherical', function () {
        cspolar.spherical()[2].should.be.equal(0);
    });
});

describe('cart3d node', function () {
    it('should convert to cylindrical', function() {
        var rtz = csCart3d.cyl(),
            r = rtz[0], t = rtz[1], z = rtz[2];
        r.should.be.approximately(Math.sqrt(2), 0.001);
        t.should.be.approximately(Math.PI/4, 0.001);
        z.should.be.equal(1);
    });
    it('should convert to spherical', function(){
        var rtp = csCart3d3.sph(),
            r = rtp[0], t = rtp[1], p = rtp[2];
        r.should.be.approximately(7.07106, 0.001);
        t.should.be.approximately(53.13, 0.001);
        p.should.be.approximately(45.00, 0.0001);
    });
    it('should convert to cart3d', function(){
        var xyz = csCart3d3.cart(),
            x = xyz[0], y = xyz[1], z = xyz[2];
        x.should.be.equal(3);
        y.should.be.equal(4);
        z.should.be.equal(5);
    });
    it('should error converting to polar', function(){
        (function() {
            var xyz = csCart3d3.polar();
        }).should.throw;
    });

});

describe('cylindrical node', function () {
    it('should convert to cylindrical', function() {
        var rtz = csCyl.cyl(),
            r = rtz[0], t = rtz[1], z = rtz[2];
        r.should.be.equal(2);
        t.should.be.approximately(Math.PI/4, 0.001);
        z.should.be.equal(5);
    });
    it('should convert to spherical', function() {
        var cylCart = csCyl2.sph();
        cylCart.should.be.an.Array;
        cylCart[0].should.be.equal(5);
        cylCart[1].should.be.approximately(60, 0.1);
        cylCart[2].should.be.approximately(36.869, 0.1);
    });
    it('should convert to cart3d', function() {
        var cylCart = csCyl.cart();
        cylCart.should.be.an.Array;
        cylCart[0].should.be.approximately(2*Math.sin(Math.PI/4), 0.001);
        cylCart[1].should.be.approximately(2*Math.sin(Math.PI/4), 0.001);
        cylCart[2].should.be.equal(5);
    });
});

describe('spherical node', function () {
    it('should convert to spherical', function () {
        var rtp = csSph.spherical();
        r = rtp[0], t = rtp[1], p = rtp[2];
        r.should.be.exactly(5);
        t.should.be.approximately(60*Math.PI/180, 0.01);
        p.should.be.approximately(30*Math.PI/180, 0.01);

        rtp = csSph2.spherical();
        r = rtp[0], t = rtp[1], p = rtp[2];
        r.should.be.exactly(5);
        t.should.be.exactly(60);
        p.should.be.exactly(30);
    });
    it('should convert to cyclindrical', function () {
        var rtz = csSph2.cyl(),
            r = rtz[0], t = rtz[1], z = rtz[2];
        r.should.be.approximately(2.5, 0.1);
        t.should.be.approximately(60, 0.1);
        z.should.be.approximately(4.33, 0.1);
    });
    it('should convert to cart3d', function () {
        var xyz = csSph2.cart(),
            x = xyz[0], y = xyz[1], z = xyz[2];
        x.should.be.approximately(1.25, 0.1);
        y.should.be.approximately(2.165, 0.1);
        z.should.be.approximately(4.33, 0.1);
    });
});
