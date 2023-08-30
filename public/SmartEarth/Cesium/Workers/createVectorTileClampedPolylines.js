define(["./AttributeCompression-5e4af6de","./Matrix2-52f9f880","./combine-0259f56f","./IndexDatatype-1cbc8622","./ComponentDatatype-a9820060","./createTaskProcessorWorker","./RuntimeError-ac440aa5","./defaultValue-69ee94f4","./PixelFormat-9ceadbf3","./WebGLConstants-f63312fc"],(function(t,e,a,s,n,r,i,o,c,l){"use strict";const d=32767,f=Math.cos(n.CesiumMath.toRadians(150)),u=new e.Cartographic,h=new e.Cartesian3;const C=new e.Cartographic,p=new e.Cartographic;function m(t){const e=8*t,a=3*e,n=4*e;this.startEllipsoidNormals=new Float32Array(a),this.endEllipsoidNormals=new Float32Array(a),this.startPositionAndHeights=new Float32Array(n),this.startFaceNormalAndVertexCornerIds=new Float32Array(n),this.endPositionAndHeights=new Float32Array(n),this.endFaceNormalAndHalfWidths=new Float32Array(n),this.vertexBatchIds=new Uint16Array(e),this.indices=s.IndexDatatype.createTypedArray(e,36*t),this.vec3Offset=0,this.vec4Offset=0,this.batchIdOffset=0,this.indexOffset=0,this.volumeStartIndex=0}const b=new e.Cartesian3,A=new e.Cartesian3;function w(t,a,s,n,r){const i=e.Cartesian3.subtract(s,a,A);let o=e.Cartesian3.subtract(a,t,b);return e.Cartesian3.normalize(i,i),e.Cartesian3.normalize(o,o),e.Cartesian3.dot(i,o)<f&&(o=e.Cartesian3.multiplyByScalar(o,-1,b)),e.Cartesian3.add(i,o,r),e.Cartesian3.equals(r,e.Cartesian3.ZERO)&&(r=e.Cartesian3.subtract(t,a)),e.Cartesian3.cross(r,n,r),e.Cartesian3.cross(n,r,r),e.Cartesian3.normalize(r,r),r}const g=[0,2,6,0,6,4,0,1,3,0,3,2,0,4,5,0,5,1,5,3,1,5,7,3,7,5,4,7,4,6,7,6,2,7,2,3],y=g.length,N=new e.Cartesian3,k=new e.Cartesian3,x=new e.Cartesian3,I=new e.Cartesian3,E=new e.Cartesian3;m.prototype.addVolume=function(t,a,s,n,r,i,o,c,l,d){let f=e.Cartesian3.add(a,l,N);const u=d.geodeticSurfaceNormal(f,k);f=e.Cartesian3.add(s,l,N);const h=d.geodeticSurfaceNormal(f,I),C=w(t,a,s,u,x),p=w(n,s,a,h,E),m=this.startEllipsoidNormals,b=this.endEllipsoidNormals,A=this.startPositionAndHeights,F=this.startFaceNormalAndVertexCornerIds,H=this.endPositionAndHeights,P=this.endFaceNormalAndHalfWidths,O=this.vertexBatchIds;let v,D=this.batchIdOffset,S=this.vec3Offset,M=this.vec4Offset;for(v=0;v<8;v++)e.Cartesian3.pack(u,m,S),e.Cartesian3.pack(h,b,S),e.Cartesian3.pack(a,A,M),A[M+3]=r,e.Cartesian3.pack(s,H,M),H[M+3]=i,e.Cartesian3.pack(C,F,M),F[M+3]=v,e.Cartesian3.pack(p,P,M),P[M+3]=o,O[D++]=c,S+=3,M+=4;this.batchIdOffset=D,this.vec3Offset=S,this.vec4Offset=M;const R=this.indices,U=this.volumeStartIndex,B=this.indexOffset;for(v=0;v<y;v++)R[B+v]=g[v]+U;this.volumeStartIndex+=8,this.indexOffset+=y};const F=new e.Rectangle,H=new e.Ellipsoid,P=new e.Cartesian3,O=new e.Cartesian3,v=new e.Cartesian3,D=new e.Cartesian3,S=new e.Cartesian3;return r((function(r,i){const o=new Uint16Array(r.positions),c=new Uint16Array(r.widths),l=new Uint32Array(r.counts),f=new Uint16Array(r.batchIds),b=F,A=H,w=P,g=new Float64Array(r.packedBuffer);let y=0;const N=g[y++],k=g[y++];let x;e.Rectangle.unpack(g,y,b),y+=e.Rectangle.packedLength,e.Ellipsoid.unpack(g,y,A),y+=e.Ellipsoid.packedLength,e.Cartesian3.unpack(g,y,w);let I=o.length/3;const E=o.subarray(0,I),M=o.subarray(I,2*I),R=o.subarray(2*I,3*I);t.AttributeCompression.zigZagDeltaDecode(E,M,R),function(t,a,s,n){const r=n.length,i=t.length,o=new Uint8Array(i),c=C,l=p;let d=0;for(let s=0;s<r;s++){const r=n[s];let i=r;for(let s=1;s<r;s++){const n=d+s,r=n-1;l.longitude=t[n],l.latitude=a[n],c.longitude=t[r],c.latitude=a[r],e.Cartographic.equals(l,c)&&(i--,o[r]=1)}n[s]=i,d+=r}let f=0;for(let e=0;e<i;e++)1!==o[e]&&(t[f]=t[e],a[f]=a[e],s[f]=s[e],f++)}(E,M,R,l);const U=l.length;let B=0;for(x=0;x<U;x++){B+=l[x]-1}const V=new m(B),T=function(t,a,s,r,i,o,c){const l=t.length,f=new Float64Array(3*l);for(let C=0;C<l;++C){const l=t[C],p=a[C],m=s[C],b=n.CesiumMath.lerp(r.west,r.east,l/d),A=n.CesiumMath.lerp(r.south,r.north,p/d),w=n.CesiumMath.lerp(i,o,m/d),g=e.Cartographic.fromRadians(b,A,w,u),y=c.cartographicToCartesian(g,h);e.Cartesian3.pack(y,f,3*C)}return f}(E,M,R,b,N,k,A);I=E.length;const W=new Float32Array(3*I);for(x=0;x<I;++x)W[3*x]=T[3*x]-w.x,W[3*x+1]=T[3*x+1]-w.y,W[3*x+2]=T[3*x+2]-w.z;let z=0,q=0;for(x=0;x<U;x++){const t=l[x]-1,a=.5*c[x],s=f[x],r=z;for(let i=0;i<t;i++){const o=e.Cartesian3.unpack(W,z,v),c=e.Cartesian3.unpack(W,z+3,D);let l=R[q],f=R[q+1];l=n.CesiumMath.lerp(N,k,l/d),f=n.CesiumMath.lerp(N,k,f/d),q++;let u=O,h=S;if(0===i){const a=r+3*t,s=e.Cartesian3.unpack(W,a,O);if(e.Cartesian3.equals(s,o))e.Cartesian3.unpack(W,a-3,u);else{const t=e.Cartesian3.subtract(o,c,O);u=e.Cartesian3.add(t,o,O)}}else e.Cartesian3.unpack(W,z-3,u);if(i===t-1){const t=e.Cartesian3.unpack(W,r,S);if(e.Cartesian3.equals(t,c))e.Cartesian3.unpack(W,r+3,h);else{const t=e.Cartesian3.subtract(c,o,S);h=e.Cartesian3.add(t,c,S)}}else e.Cartesian3.unpack(W,z+6,h);V.addVolume(u,o,c,h,l,f,a,s,w,A),z+=3}z+=3,q++}const L=V.indices;i.push(V.startEllipsoidNormals.buffer),i.push(V.endEllipsoidNormals.buffer),i.push(V.startPositionAndHeights.buffer),i.push(V.startFaceNormalAndVertexCornerIds.buffer),i.push(V.endPositionAndHeights.buffer),i.push(V.endFaceNormalAndHalfWidths.buffer),i.push(V.vertexBatchIds.buffer),i.push(L.buffer);let _={indexDatatype:2===L.BYTES_PER_ELEMENT?s.IndexDatatype.UNSIGNED_SHORT:s.IndexDatatype.UNSIGNED_INT,startEllipsoidNormals:V.startEllipsoidNormals.buffer,endEllipsoidNormals:V.endEllipsoidNormals.buffer,startPositionAndHeights:V.startPositionAndHeights.buffer,startFaceNormalAndVertexCornerIds:V.startFaceNormalAndVertexCornerIds.buffer,endPositionAndHeights:V.endPositionAndHeights.buffer,endFaceNormalAndHalfWidths:V.endFaceNormalAndHalfWidths.buffer,vertexBatchIds:V.vertexBatchIds.buffer,indices:L.buffer};if(r.keepDecodedPositions){const t=function(t){const e=t.length,a=new Uint32Array(e+1);let s=0;for(let n=0;n<e;++n)a[n]=s,s+=t[n];return a[e]=s,a}(l);i.push(T.buffer,t.buffer),_=a.combine(_,{decodedPositions:T.buffer,decodedPositionOffsets:t.buffer})}return _}))}));