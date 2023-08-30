define(["./GeometryOffsetAttribute-4d39b441","./Transforms-3e1dc9c2","./Matrix2-52f9f880","./RuntimeError-ac440aa5","./ComponentDatatype-a9820060","./defaultValue-69ee94f4","./GeometryAttribute-c774c37f","./GeometryAttributes-1b4134a9","./_commonjsHelpers-3aae1032-15991586","./combine-0259f56f","./PixelFormat-9ceadbf3","./WebGLConstants-f63312fc"],(function(e,t,n,a,i,r,o,u,s,m,f,c){"use strict";const l=new n.Cartesian3;function p(e){const t=(e=r.defaultValue(e,r.defaultValue.EMPTY_OBJECT)).minimum,a=e.maximum;this._min=n.Cartesian3.clone(t),this._max=n.Cartesian3.clone(a),this._offsetAttribute=e.offsetAttribute,this._workerName="createBoxOutlineGeometry"}p.fromDimensions=function(e){const t=(e=r.defaultValue(e,r.defaultValue.EMPTY_OBJECT)).dimensions,a=n.Cartesian3.multiplyByScalar(t,.5,new n.Cartesian3);return new p({minimum:n.Cartesian3.negate(a,new n.Cartesian3),maximum:a,offsetAttribute:e.offsetAttribute})},p.fromAxisAlignedBoundingBox=function(e){return new p({minimum:e.minimum,maximum:e.maximum})},p.packedLength=2*n.Cartesian3.packedLength+1,p.pack=function(e,t,a){return a=r.defaultValue(a,0),n.Cartesian3.pack(e._min,t,a),n.Cartesian3.pack(e._max,t,a+n.Cartesian3.packedLength),t[a+2*n.Cartesian3.packedLength]=r.defaultValue(e._offsetAttribute,-1),t};const d=new n.Cartesian3,y=new n.Cartesian3,C={minimum:d,maximum:y,offsetAttribute:void 0};return p.unpack=function(e,t,a){t=r.defaultValue(t,0);const i=n.Cartesian3.unpack(e,t,d),o=n.Cartesian3.unpack(e,t+n.Cartesian3.packedLength,y),u=e[t+2*n.Cartesian3.packedLength];return r.defined(a)?(a._min=n.Cartesian3.clone(i,a._min),a._max=n.Cartesian3.clone(o,a._max),a._offsetAttribute=-1===u?void 0:u,a):(C.offsetAttribute=-1===u?void 0:u,new p(C))},p.createGeometry=function(a){const s=a._min,m=a._max;if(n.Cartesian3.equals(s,m))return;const f=new u.GeometryAttributes,c=new Uint16Array(24),p=new Float64Array(24);p[0]=s.x,p[1]=s.y,p[2]=s.z,p[3]=m.x,p[4]=s.y,p[5]=s.z,p[6]=m.x,p[7]=m.y,p[8]=s.z,p[9]=s.x,p[10]=m.y,p[11]=s.z,p[12]=s.x,p[13]=s.y,p[14]=m.z,p[15]=m.x,p[16]=s.y,p[17]=m.z,p[18]=m.x,p[19]=m.y,p[20]=m.z,p[21]=s.x,p[22]=m.y,p[23]=m.z,f.position=new o.GeometryAttribute({componentDatatype:i.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:p}),c[0]=4,c[1]=5,c[2]=5,c[3]=6,c[4]=6,c[5]=7,c[6]=7,c[7]=4,c[8]=0,c[9]=1,c[10]=1,c[11]=2,c[12]=2,c[13]=3,c[14]=3,c[15]=0,c[16]=0,c[17]=4,c[18]=1,c[19]=5,c[20]=2,c[21]=6,c[22]=3,c[23]=7;const d=n.Cartesian3.subtract(m,s,l),y=.5*n.Cartesian3.magnitude(d);if(r.defined(a._offsetAttribute)){const t=p.length,n=new Uint8Array(t/3),r=a._offsetAttribute===e.GeometryOffsetAttribute.NONE?0:1;e.arrayFill(n,r),f.applyOffset=new o.GeometryAttribute({componentDatatype:i.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:n})}return new o.Geometry({attributes:f,indices:c,primitiveType:o.PrimitiveType.LINES,boundingSphere:new t.BoundingSphere(n.Cartesian3.ZERO,y),offsetAttribute:a._offsetAttribute})},function(e,t){return r.defined(t)&&(e=p.unpack(e,t)),p.createGeometry(e)}}));
