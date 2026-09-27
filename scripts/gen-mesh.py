"""
Regenerates lib/mesh.json (the Fig. 0 face mesh) from MediaPipe's canonical face model.

    curl -sLO https://raw.githubusercontent.com/google/mediapipe/master/mediapipe/modules/face_geometry/data/canonical_face_model.obj
    curl -sL -o conn.py https://raw.githubusercontent.com/google/mediapipe/master/mediapipe/python/solutions/face_mesh_connections.py
    python3 scripts/gen-mesh.py && mv mesh.json lib/mesh.json

Tweak `ay` / `ax` to change the viewing angle.
"""
import math, re, json
V=[tuple(map(float,l.split()[1:4])) for l in open('canonical_face_model.obj') if l.startswith('v ')]
src=open('conn.py').read()
def conns(name):
    m=re.search(name+r' = frozenset\(\[(.*?)\]\)',src,re.S)
    return [tuple(map(int,p)) for p in re.findall(r'\((\d+),\s*(\d+)\)',m.group(1))]
contour=set()
for n in ['FACEMESH_LIPS','FACEMESH_LEFT_EYE','FACEMESH_LEFT_EYEBROW','FACEMESH_RIGHT_EYE','FACEMESH_RIGHT_EYEBROW','FACEMESH_FACE_OVAL','FACEMESH_NOSE']:
    contour|=set(conns(n))
tess=set(tuple(sorted(e)) for e in conns('FACEMESH_TESSELATION'))
# rotate about y (three-quarter view) and a touch about x
ay=math.radians(-22); ax=math.radians(6)
P=[]
for x,y,z in V:
    x2=x*math.cos(ay)+z*math.sin(ay); z2=-x*math.sin(ay)+z*math.cos(ay)
    y2=y*math.cos(ax)-z2*math.sin(ax); z3=y*math.sin(ax)+z2*math.cos(ax)
    P.append((x2,-y2,z3))
xs=[p[0] for p in P]; ys=[p[1] for p in P]; zs=[p[2] for p in P]
W,H=400,480; pad=24
s=min((W-2*pad)/(max(xs)-min(xs)),(H-2*pad)/(max(ys)-min(ys)))
ox=(W-(max(xs)-min(xs))*s)/2-min(xs)*s; oy=(H-(max(ys)-min(ys))*s)/2-min(ys)*s
Q=[(round(p[0]*s+ox,1),round(p[1]*s+oy,1),p[2]) for p in P]
f=lambda v:('%g'%v)
def path(edges): return ''.join('M%s %sL%s %s'%(f(Q[a][0]),f(Q[a][1]),f(Q[b][0]),f(Q[b][1])) for a,b in sorted(edges))
zmin,zmax=min(zs),max(zs)
buckets=[[],[],[]]
for i,(x,y,z) in enumerate(Q):
    t=(z-zmin)/(zmax-zmin); buckets[min(2,int(t*3))].append(i)
pts=[''.join('M%s %sh0'%(f(Q[i][0]),f(Q[i][1])) for i in b) for b in buckets]
out={'viewBox':f'0 0 {W} {H}','tess':path(tess-set(tuple(sorted(e)) for e in contour)),'contour':path(contour),'points':pts,
     # anchor landmarks for callouts: nose tip 1, right eye outer 33, left eye outer 263, chin 152
     'anchors':{k:[Q[i][0],Q[i][1]] for k,i in {'nose':1,'eyeR':33,'eyeL':263,'chin':152,'brow':105}.items()}}
open('mesh.json','w').write(json.dumps(out))
print(len(tess),len(contour),[len(b) for b in buckets],sum(len(v) for v in out.values() if isinstance(v,str)))
print(out['anchors'])
