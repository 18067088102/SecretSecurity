define(["./Matrix2-52f9f880","./defaultValue-69ee94f4","./EllipseOutlineGeometry-5cfe5748","./RuntimeError-ac440aa5","./ComponentDatatype-a9820060","./WebGLConstants-f63312fc","./PixelFormat-9ceadbf3","./GeometryOffsetAttribute-4d39b441","./Transforms-3e1dc9c2","./_commonjsHelpers-3aae1032-15991586","./combine-0259f56f","./EllipseGeometryLibrary-0b8e2e45","./GeometryAttribute-c774c37f","./GeometryAttributes-1b4134a9","./IndexDatatype-1cbc8622"],(function(e,t,r,i,n,o,a,l,c,f,s,m,u,p,b){"use strict";return function(i,n){return t.defined(n)&&(i=r.EllipseOutlineGeometry.unpack(i,n)),i._center=e.Cartesian3.clone(i._center),i._ellipsoid=e.Ellipsoid.clone(i._ellipsoid),r.EllipseOutlineGeometry.createGeometry(i)}}));