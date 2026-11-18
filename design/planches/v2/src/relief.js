// Relief — tiny raymarched WebGL scene, zero dependency, zero network.
// White plaster objects on a white wall, key light from the LEFT, shade on the RIGHT (Flow Computing).
// Scenes: 'links' = two interlocked rings (deadlock: 101 waits for 102 waits for 101), one red.
//         'ring'  = circular trace buffer, segmented; a write head sweeps; the crash segment is red.
// Exposes window.__relief = { ok, running } for verify.mjs.
(() => {
  const cv = document.querySelector('canvas[data-relief]');
  window.__relief = { ok: false, running: false };
  if (!cv) return;
  const gl = cv.getContext('webgl', { antialias: false, preserveDrawingBuffer: true });
  if (!gl) { document.documentElement.classList.add('no-gl'); return; }
  const mode = cv.dataset.relief === 'ring' ? 1 : 0;
  const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FS = `precision highp float;
uniform vec2 R;uniform float T;uniform float M;uniform vec3 BG;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float tor(vec3 p,vec2 t){vec2 q=vec2(length(p.xz)-t.x,p.y);return length(q)-t.y;}
vec2 links(vec3 p){
  p.xz*=rot(.35+.18*sin(T*.25));p.yz*=rot(-.25);
  vec3 a=p-vec3(-.62,0.,0.);a.yz*=rot(1.5708);
  vec3 b=p-vec3(.62,0.,0.);
  float da=tor(a,vec2(.95,.26)),db=tor(b,vec2(.95,.26));
  return da<db?vec2(da,1.):vec2(db,2.);}
vec2 ring(vec3 p){
  p.x-=.35;p.yz*=rot(-1.05);
  float ang=atan(p.z,p.x);float seg=6.2832/24.;
  float id=floor((ang+3.1416)/seg);
  float head=mod(T*.55,6.2832)-3.1416;float hid=floor((head+3.1416)/seg);
  float age=mod(hid-id+24.,24.);
  float lift=.10*exp(-age*.6);
  float m2=mod(ang+3.1416,seg);float a2=min(m2,seg-m2);
  vec2 q=vec2(length(p.xz)-1.02,p.y-lift);
  float d=max(abs(q.x)-.24,abs(q.y)-.11)-.045;
  d=max(d,(.006-a2*.9));
  float crash=step(abs(id-5.),.5)*step(5.,age);
  return vec2(d,crash>.5?2.:1.);}
vec2 map(vec3 p){
  vec2 o=M<.5?links(p):ring(p);
  float wall=p.z+1.35;
  return wall<o.x?vec2(wall,0.):o;}
vec3 nrm(vec3 p){vec2 e=vec2(.0015,0.);return normalize(vec3(map(p+e.xyy).x-map(p-e.xyy).x,map(p+e.yxy).x-map(p-e.yxy).x,map(p+e.yyx).x-map(p-e.yyx).x));}
float shadow(vec3 o,vec3 d){float r=1.,t=.03;for(int i=0;i<36;i++){float h=map(o+d*t).x;r=min(r,9.*h/t);t+=clamp(h,.02,.25);if(r<.002||t>6.)break;}return clamp(r,0.,1.);}
float ao(vec3 p,vec3 n){float o=0.,s=1.;for(int i=1;i<6;i++){float h=.06*float(i);o+=(h-map(p+n*h).x)*s;s*=.7;}return clamp(1.-2.2*o,0.,1.);}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;
  bool land=R.x>R.y*1.1;
  vec3 ro=land?vec3(-1.05,-.15,8.2):vec3(0.,0.,7.2);
  vec3 rd=normalize(vec3(uv,-1.9));
  float t=0.;vec2 h=vec2(0.);
  for(int i=0;i<120;i++){h=map(ro+rd*t);if(h.x<.0012||t>14.)break;t+=h.x*.9;}
  vec3 col=BG;
  if(t<14.){
    vec3 p=ro+rd*t,n=nrm(p);
    vec3 L=normalize(vec3(-.85,.55,.75));
    float sh=shadow(p+n*.003,L);
    float dif=max(dot(n,L),0.)*sh;
    float a=mix(.55,1.,ao(p,n));
    if(h.y<.5){gl_FragColor=vec4(pow(BG*(1.-.19*(1.-sh))*(.8+.2*a),vec3(1.)),1.);return;}
    vec3 alb=h.y>1.5?vec3(.78,.16,.16):(h.y>.5?vec3(.97,.965,.95):BG*1.02);
    float amb=.62+.38*n.y*.5+.2;
    col=alb*(amb*a*.72+dif*.55);
    float spec=pow(max(dot(reflect(-L,n),-rd),0.),24.)*.12*step(.5,h.y);
    col+=spec;
  }
  col=pow(col,vec3(.92));
  col=min(col,vec3(1.));
  gl_FragColor=vec4(col,1.);}`;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pr); gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n);
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--wall').trim().match(/\w\w/g).map(x => parseInt(x, 16) / 255);
  gl.uniform3f(U('BG'), bg[0], bg[1], bg[2]); gl.uniform1f(U('M'), mode);
  const size = () => { const s = Math.min(1, 1280 / Math.max(cv.clientWidth, 1)); cv.width = Math.round(cv.clientWidth * s); cv.height = Math.round(cv.clientHeight * s); gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(U('R'), cv.width, cv.height); };
  const draw = t => { gl.uniform1f(U('T'), t); gl.drawArrays(gl.TRIANGLES, 0, 3); };
  size();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const still = 7.2; // frozen frame: write head just past the crash segment
  draw(still); window.__relief.ok = true;
  let raf = 0, t0 = performance.now(), visible = true;
  const loop = now => { draw(still + (now - t0) / 1000); raf = requestAnimationFrame(loop); };
  const sync = () => {
    const go = !reduce.matches && visible;
    if (go && !raf) { raf = requestAnimationFrame(loop); }
    if (!go && raf) { cancelAnimationFrame(raf); raf = 0; draw(still); }
    window.__relief.running = !!raf;
  };
  new IntersectionObserver(e => { visible = e[0].isIntersecting; sync(); }).observe(cv);
  reduce.addEventListener('change', sync);
  addEventListener('resize', () => { size(); draw(still); });
  sync();
})();
