define(["./defaultValue-69ee94f4","./Matrix2-52f9f880","./Transforms-3e1dc9c2","./ComponentDatatype-a9820060","./RuntimeError-ac440aa5","./GeometryAttribute-c774c37f","./GeometryAttributes-1b4134a9","./IndexDatatype-1cbc8622","./WallGeometryLibrary-104cc441","./PixelFormat-9ceadbf3","./WebGLConstants-f63312fc","./_commonjsHelpers-3aae1032-15991586","./combine-0259f56f","./arrayRemoveDuplicates-fe254feb","./PolylinePipeline-96d5682f","./EllipsoidGeodesic-00b2a9dd","./EllipsoidRhumbLine-683f2cb5","./IntersectionTests-088640d2","./Plane-e5b2f6e0"],(function(e,i,t,n,o,a,s,r,l,m,d,u,c,p,f,h,g,y,_){"use strict";const E=new i.Cartesian3,H=new i.Cartesian3;function b(t){const o=(t=e.defaultValue(t,e.defaultValue.EMPTY_OBJECT)).positions,a=t.maximumHeights,s=t.minimumHeights,r=e.defaultValue(t.granularity,n.CesiumMath.RADIANS_PER_DEGREE),l=e.defaultValue(t.ellipsoid,i.Ellipsoid.WGS84);this._positions=o,this._minimumHeights=s,this._maximumHeights=a,this._granularity=r,this._ellipsoid=i.Ellipsoid.clone(l),this._workerName="createWallOutlineGeometry";let m=1+o.length*i.Cartesian3.packedLength+2;e.defined(s)&&(m+=s.length),e.defined(a)&&(m+=a.length),this.packedLength=m+i.Ellipsoid.packedLength+1}b.pack=function(t,n,o){let a;o=e.defaultValue(o,0);const s=t._positions;let r=s.length;for(n[o++]=r,a=0;a<r;++a,o+=i.Cartesian3.packedLength)i.Cartesian3.pack(s[a],n,o);const l=t._minimumHeights;if(r=e.defined(l)?l.length:0,n[o++]=r,e.defined(l))for(a=0;a<r;++a)n[o++]=l[a];const m=t._maximumHeights;if(r=e.defined(m)?m.length:0,n[o++]=r,e.defined(m))for(a=0;a<r;++a)n[o++]=m[a];return i.Ellipsoid.pack(t._ellipsoid,n,o),n[o+=i.Ellipsoid.packedLength]=t._granularity,n};const C=i.Ellipsoid.clone(i.Ellipsoid.UNIT_SPHERE),A={positions:void 0,minimumHeights:void 0,maximumHeights:void 0,ellipsoid:C,granularity:void 0};return b.unpack=function(t,n,o){let a;n=e.defaultValue(n,0);let s=t[n++];const r=new Array(s);for(a=0;a<s;++a,n+=i.Cartesian3.packedLength)r[a]=i.Cartesian3.unpack(t,n);let l,m;if(s=t[n++],s>0)for(l=new Array(s),a=0;a<s;++a)l[a]=t[n++];if(s=t[n++],s>0)for(m=new Array(s),a=0;a<s;++a)m[a]=t[n++];const d=i.Ellipsoid.unpack(t,n,C),u=t[n+=i.Ellipsoid.packedLength];return e.defined(o)?(o._positions=r,o._minimumHeights=l,o._maximumHeights=m,o._ellipsoid=i.Ellipsoid.clone(d,o._ellipsoid),o._granularity=u,o):(A.positions=r,A.minimumHeights=l,A.maximumHeights=m,A.granularity=u,new b(A))},b.fromConstantHeights=function(i){const t=(i=e.defaultValue(i,e.defaultValue.EMPTY_OBJECT)).positions;let n,o;const a=i.minimumHeight,s=i.maximumHeight,r=e.defined(a),l=e.defined(s);if(r||l){const e=t.length;n=r?new Array(e):void 0,o=l?new Array(e):void 0;for(let i=0;i<e;++i)r&&(n[i]=a),l&&(o[i]=s)}return new b({positions:t,maximumHeights:o,minimumHeights:n,ellipsoid:i.ellipsoid})},b.createGeometry=function(o){const m=o._positions,d=o._minimumHeights,u=o._maximumHeights,c=o._granularity,p=o._ellipsoid,f=l.WallGeometryLibrary.computePositions(p,m,u,d,c,!1);if(!e.defined(f))return;const h=f.bottomPositions,g=f.topPositions;let y=g.length,_=2*y;const b=new Float64Array(_);let C,A=0;for(y/=3,C=0;C<y;++C){const e=3*C,t=i.Cartesian3.fromArray(g,e,E),n=i.Cartesian3.fromArray(h,e,H);b[A++]=n.x,b[A++]=n.y,b[A++]=n.z,b[A++]=t.x,b[A++]=t.y,b[A++]=t.z}const k=new s.GeometryAttributes({position:new a.GeometryAttribute({componentDatatype:n.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:b})}),w=_/3;_=2*w-4+w;const x=r.IndexDatatype.createTypedArray(w,_);let G=0;for(C=0;C<w-2;C+=2){const e=C,t=C+2,o=i.Cartesian3.fromArray(b,3*e,E),a=i.Cartesian3.fromArray(b,3*t,H);if(i.Cartesian3.equalsEpsilon(o,a,n.CesiumMath.EPSILON10))continue;const s=C+1,r=C+3;x[G++]=s,x[G++]=e,x[G++]=s,x[G++]=r,x[G++]=e,x[G++]=t}return x[G++]=w-2,x[G++]=w-1,new a.Geometry({attributes:k,indices:x,primitiveType:a.PrimitiveType.LINES,boundingSphere:new t.BoundingSphere.fromVertices(b)})},function(t,n){return e.defined(n)&&(t=b.unpack(t,n)),t._ellipsoid=i.Ellipsoid.clone(t._ellipsoid),b.createGeometry(t)}}));
