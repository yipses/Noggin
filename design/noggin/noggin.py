"""
noggin.py: draws the Noggin character (design D2) as a standalone SVG.

This is the code the final character was designed with. Every rule in
docs/noggin-character.md maps to a parameter here, so new iterations
(expressions, colourways, poses) should start by changing presets below,
not by redrawing.

Usage:
    python noggin.py                 # writes noggin-calm.svg, noggin-happy.svg, noggin-sleepy.svg
    python noggin.py --list          # lists presets

Drawing space: 360 x 420 units. The body sits roughly between x 46..314, y 125..345.
"""
import sys, math

CONTOUR='#B56C7B'; SHADE='#ECAFB8'; HI='#FADCE0'; EYE='#3B2A2E'; BLUSH='#EE97A1'

def qpts(p0,c,p1,n=24):
    return [[(1-t)**2*p0[0]+2*(1-t)*t*c[0]+t*t*p1[0],(1-t)**2*p0[1]+2*(1-t)*t*c[1]+t*t*p1[1]] for t in [i/n for i in range(1,n+1)]]
def cpts(p0,p1,p2,p3,n=40):
    out=[]
    for i in range(1,n+1):
        t=i/n;u=1-t
        out.append([u**3*p0[k]+3*u*u*t*p1[k]+3*u*t*t*p2[k]+t**3*p3[k] for k in range(2)])
    return out

def outline(bumps=3, depths=None, notch=4, a0=200, a1=340, rx=116, ryt=112, ey=264, bw=134, by=330, s=38, a=44, jitter=None):
    segs=2*bumps; pts=[]
    for i in range(segs+1):
        t=math.radians(a0+(a1-a0)*i/segs)
        pts.append([180+rx*math.cos(t), ey+ryt*math.sin(t)])
    pts[bumps][1]+=notch
    depths=depths or [17]*segs
    if jitter: depths=[d*j for d,j in zip(depths,jitter)]
    poly=[pts[0][:]]
    for i in range(segs):
        p,q=pts[i],pts[i+1]; mx,my=(p[0]+q[0])/2,(p[1]+q[1])/2
        vx,vy=mx-180,my-ey; L=math.hypot(vx,vy)
        poly+=qpts(p,[mx+vx/L*depths[i]*2,my+vy/L*depths[i]*2],q)
    (x0,y0),(x1,y1)=pts[0],pts[-1]
    poly+=cpts((x1,y1),(x1+s,y1+a),(180+bw,by),(180,by))
    poly+=cpts((180,by),(180-bw,by),(x0-s,y0+a),(x0,y0))[:-1]
    return poly

def chaikin(poly, it=3):
    for _ in range(it):
        new=[]
        n=len(poly)
        for i in range(n):
            p,q=poly[i],poly[(i+1)%n]
            new.append([0.75*p[0]+0.25*q[0],0.75*p[1]+0.25*q[1]])
            new.append([0.25*p[0]+0.75*q[0],0.25*p[1]+0.75*q[1]])
        poly=new
    return poly

def offset(poly, wtop, wbot):
    n=len(poly); out=[]
    # orientation: compute signed area to pick outward normal
    area=sum(poly[i][0]*poly[(i+1)%n][1]-poly[(i+1)%n][0]*poly[i][1] for i in range(n))
    sgn=1 if area>0 else -1
    for i in range(n):
        p0,p1=poly[i-1],poly[(i+1)%n]
        tx,ty=p1[0]-p0[0],p1[1]-p0[1]; L=math.hypot(tx,ty) or 1
        nx,ny=ty/L*sgn,-tx/L*sgn
        # ensure outward: nx,ny should point away from centroid roughly
        w=wtop+(wbot-wtop)*(ny+1)/2
        out.append([poly[i][0]+nx*w, poly[i][1]+ny*w])
    return out

def inset_shade(poly, w=15):
    n=len(poly); cx=sum(p[0] for p in poly)/n; cy=sum(p[1] for p in poly)/n
    out=[]
    for i in range(n):
        p0,p1=poly[i-1],poly[(i+1)%n]
        tx,ty=p1[0]-p0[0],p1[1]-p0[1]; L=math.hypot(tx,ty) or 1
        nx,ny=ty/L,-tx/L
        if (poly[i][0]-cx)*nx+(poly[i][1]-cy)*ny<0: nx,ny=-nx,-ny
        k=max(0.0,0.75*ny+0.45*nx)
        t=min(1.0,max(0.0,(poly[i][1]-245)/40)); k*=t*t*(3-2*t)
        out.append([poly[i][0]-nx*w*k, poly[i][1]-ny*w*k])
    return chaikin(out,1)

def pathd(poly):
    return 'M'+' L'.join(f'{x:.1f} {y:.1f}' for x,y in poly)+' Z'

def ellipse_poly(cx,cy,rx,ry,n=80):
    return [[cx+rx*math.cos(2*math.pi*i/n), cy+ry*math.sin(2*math.pi*i/n)] for i in range(n)]

def art(shade=True, highlights=2, jitter=None, uid='a', shape=None, smooth=3, blush=True, mouth='smile', feet_dx=34, cw=(2.2,5.2), paw_r=(19,12.5), paws='circle', crease=None, curl_w=None, folds=0, fold_idx=None, cline=0, fold_hook=0, fold_color=None, side_folds=(), fold_curve=4, fold_wmul=1.05, squigs=(), hi_pos=(122,196), face_dy=0, eyes='open'):
    body='{{body}}'
    poly=chaikin(outline(jitter=jitter, **(shape or {})),smooth)
    outer=offset(poly,cw[0],cw[1])
    # check outward: outer area larger
    def area(p): return abs(sum(p[i][0]*p[(i+1)%len(p)][1]-p[(i+1)%len(p)][0]*p[i][1] for i in range(len(p))))/2
    if area(outer)<area(poly): outer=offset(poly,-cw[0],-cw[1])
    by=330
    svg=f'<ellipse cx="180" cy="{by+12}" rx="118" ry="11" fill="#D9D2C8" opacity="0.6"></ellipse>'
    svg+=f'<path d="{pathd(outer)}" fill="{CONTOUR}"></path>'
    pawfills=''
    if paws in ('merged','curl'):
        def ar2(p): return abs(sum(p[i][0]*p[(i+1)%len(p)][1]-p[(i+1)%len(p)][0]*p[i][1] for i in range(len(p))))/2
        for cx in (180-feet_dx,180+feet_dx):
            pp=ellipse_poly(cx,by-4,paw_r[0],paw_r[1])
            po=offset(pp,cw[0]*0.9,cw[1]*0.85)
            if ar2(po)<ar2(pp): po=offset(pp,-cw[0]*0.9,-cw[1]*0.85)
            if paws=='merged': svg+=f'<path d="{pathd(po)}" fill="{CONTOUR}"></path>'
            pawfills+=f'<path d="{pathd(pp)}" fill="{SHADE}"></path>'
            top=[[x,y-3] for x,y in ellipse_poly(cx,by-4,paw_r[0]-1,paw_r[1]-2)]
            pawfills+=f'<path d="{pathd(top)}" fill="{body}"></path>'
    svg+=f'<defs><clipPath id="clip{uid}"><path d="{pathd(poly)}"></path></clipPath></defs>'
    svg+=f'<g clip-path="url(#clip{uid})">'
    if shade:
        svg+=f'<path d="{pathd(poly)}" fill="{SHADE}"></path>'
        svg+=f'<path d="{pathd(inset_shade(poly))}" fill="{body}"></path>'
    else:
        svg+=f'<path d="{pathd(poly)}" fill="{body}"></path>'
    if highlights>=1:
        svg+=f'<ellipse cx="{hi_pos[0]}" cy="{hi_pos[1]}" rx="19" ry="10" fill="{HI}" transform="rotate(-30 {hi_pos[0]} {hi_pos[1]})"></ellipse>'
    if highlights>=2:
        svg+=f'<circle cx="101" cy="216" r="4.5" fill="{HI}"></circle>'
    svg+='</g>'
    svg+=pawfills
    for (qx,qy,qa,ql,qamp,kind) in squigs:
        ca,sa=math.cos(math.radians(qa)),math.sin(math.radians(qa))
        n=28; pts=[]
        for i in range(n+1):
            t=i/n; d=(t-0.5)*ql
            off=qamp*math.sin(2*math.pi*t) if kind.startswith('s') else qamp*math.sin(math.pi*t)
            pts.append((qx+ca*d-sa*off, qy+sa*d+ca*off))
        L=[];R=[]
        for i,(x,y) in enumerate(pts):
            a=pts[max(0,i-1)]; b=pts[min(n,i+1)]
            tx,ty=b[0]-a[0],b[1]-a[1]; ln=math.hypot(tx,ty) or 1
            nx,ny=-ty/ln,tx/ln; t=i/n
            w=(cw[0]*1.1*((1-t)**1.1)+0.25) if kind.endswith('_e') else (cw[0]*1.05*(math.sin(math.pi*t)**0.6)+0.25)
            L.append((x+nx*w/2,y+ny*w/2)); R.append((x-nx*w/2,y-ny*w/2))
        svg+=f'<path d="{pathd(L+R[::-1])}" fill="{fold_color or CONTOUR}"></path>'
    if folds or cline:
        sh=dict(bumps=3, notch=4, a0=200, a1=340, rx=116, ryt=112, ey=264); sh.update({k:v for k,v in (shape or {}).items() if k in sh})
        segs=2*sh['bumps']; J=[]
        for i in range(segs+1):
            t=math.radians(sh['a0']+(sh['a1']-sh['a0'])*i/segs)
            J.append([180+sh['rx']*math.cos(t), sh['ey']+sh['ryt']*math.sin(t)])
        J[sh['bumps']][1]+=sh['notch']
        FC=fold_color or CONTOUR
        def taper_line(p0,c,p1,w0):
            pts=qpts(p0,c,p1,20); pts=[p0]+pts; n=len(pts); L=[];R=[]
            for i,(x,y) in enumerate(pts):
                a=pts[max(0,i-1)]; b=pts[min(n-1,i+1)]
                tx,ty=b[0]-a[0],b[1]-a[1]; ln=math.hypot(tx,ty) or 1
                nx,ny=-ty/ln,tx/ln; w=w0*(1-(i/(n-1))**1.4)+0.3
                L.append((x+nx*w/2,y+ny*w/2)); R.append((x-nx*w/2,y-ny*w/2))
            return f'<path d="{pathd(L+R[::-1])}" fill="{FC}"></path>'
        idx=fold_idx if fold_idx is not None else [i for i in range(1,segs) if i!=sh['bumps']]
        if folds:
            for i in idx:
                x,y=J[i]; vx,vy=180-x,sh['ey']+30-y; ln=math.hypot(vx,vy); ux,uy=vx/ln,vy/ln
                side=1 if x<180 else -1
                x0,y0=x+ux*3,y+uy*3
                ex,ey2=x0+ux*folds,y0+uy*folds
                cx_,cy_=x0+ux*folds*0.5+uy*fold_curve*side,y0+uy*folds*0.5-ux*fold_curve*side
                if fold_hook:
                    hx,hy=ex+uy*fold_hook*side*1.0+ux*fold_hook*0.3, ey2-ux*fold_hook*side*1.0+uy*fold_hook*0.3
                    svg+=taper_line((x0,y0),(ex+ux*2,ey2+uy*2),(hx,hy),cw[0]*fold_wmul)
                else:
                    svg+=taper_line((x0,y0),(cx_,cy_),(ex,ey2),cw[0]*fold_wmul)
            if side_folds:
                bw_=(shape or {}).get('bw',134); by_=(shape or {}).get('by',330); s_=(shape or {}).get('s',38); a_=(shape or {}).get('a',44)
                x1,y1=J[-1]
                P=((x1,y1),(x1+s_,y1+a_),(180+bw_,by_),(180,by_))
                for t in side_folds:
                    u=1-t; px=u**3*P[0][0]+3*u*u*t*P[1][0]+3*u*t*t*P[2][0]+t**3*P[3][0]; py=u**3*P[0][1]+3*u*u*t*P[1][1]+3*u*t*t*P[2][1]+t**3*P[3][1]
                    for sg in (-1,1):
                        xx=180+sg*(px-180); ux,uy=-sg*0.9,-0.42
                        x0,y0=xx+ux*3,py+uy*3; ex,ey2=x0+ux*folds*0.85,y0+uy*folds*0.85
                        svg+=taper_line((x0,y0),(x0+ux*folds*0.45-uy*fold_curve*sg,y0+uy*folds*0.45+ux*fold_curve*sg),(ex,ey2),cw[0]*fold_wmul)
        if cline:
            x,y=J[sh['bumps']]
            svg+=taper_line((x,y+3),(x-2.5,y+3+cline*0.5),(x+0.5,y+3+cline),cw[0]*1.05)
    if paws=='curl':
        import math as _m
        for sgn,cx in ((-1,180-feet_dx),(1,180+feet_dx)):
            r,ry=paw_r; cy=by-4
            sw=crease if isinstance(crease,(int,float)) else 280
            if sgn<0: angs=[175-sw*i/60 for i in range(61)]
            else: angs=[5+sw*i/60 for i in range(61)]
            cl=[(cx+(r+1.5)*_m.cos(_m.radians(a)), cy+(ry+1.5)*_m.sin(_m.radians(a))) for a in angs]
            L=[];R=[]
            n=len(cl)
            for i,(x,y) in enumerate(cl):
                p0=cl[max(0,i-1)]; p1=cl[min(n-1,i+1)]
                tx,ty=p1[0]-p0[0],p1[1]-p0[1]; ln=_m.hypot(tx,ty) or 1
                nx,ny=-ty/ln,tx/ln
                a=_m.radians(angs[i]); ndown=_m.sin(a)
                wmin=curl_w if curl_w else 2.4
                w=wmin+(cw[1]*0.95-wmin)*max(0.0,ndown)
                t=i/(n-1)
                ts=0.72 if curl_w else 0.6
                if t>ts:
                    u=(t-ts)/(1-ts); w*=(1-u)**(1.0 if curl_w else 1.3)
                L.append((x+nx*w/2,y+ny*w/2)); R.append((x-nx*w/2,y-ny*w/2))
            poly=L+R[::-1]
            svg+=f'<path d="{pathd(poly)}" fill="{CONTOUR}" stroke="{CONTOUR}" stroke-width="0.6" stroke-linejoin="round"></path>'
    if paws=='merged' and crease:
        for sgn,cx in ((-1,180-feet_dx),(1,180+feet_dx)):
            r,ry=paw_r; cy=by-4
            if crease in ('inner','inner_short'):
                import math as _m
                a0,a1=(262,338) if crease=='inner' else (282,330)
                if sgn>0: a0,a1=540-a1,540-a0
                ptsx=[(cx+(r+0.5)*_m.cos(_m.radians(t)), cy+(ry+0.5)*_m.sin(_m.radians(t))) for t in [a0+(a1-a0)*i/16 for i in range(17)]]
                svg+=f'<path d="M'+' L'.join(f'{x:.1f} {y:.1f}' for x,y in ptsx)+f'" stroke="{CONTOUR}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>'
            elif crease=='arc':
                svg+=f'<path d="M{cx-0.72*r:.1f} {cy-0.69*ry:.1f} Q{cx:.1f} {cy-1.31*ry:.1f} {cx+0.72*r:.1f} {cy-0.69*ry:.1f}" stroke="{CONTOUR}" stroke-width="2.4" fill="none" stroke-linecap="round"></path>'
            else:
                ix=cx-sgn*0.85*r
                svg+=f'<path d="M{ix:.1f} {cy-ry-9:.1f} Q{ix+sgn*0.2*r:.1f} {cy-ry-1:.1f} {cx-sgn*0.25*r:.1f} {cy-0.92*ry:.1f}" stroke="{CONTOUR}" stroke-width="2.4" fill="none" stroke-linecap="round"></path>'
                svg+=f'<path d="M{cx-0.5*r:.1f} {cy-0.87*ry:.1f} Q{cx+sgn*0.1*r:.1f} {cy-1.2*ry:.1f} {cx+0.6*r:.1f} {cy-0.8*ry:.1f}" stroke="{CONTOUR}" stroke-width="2.4" fill="none" stroke-linecap="round"></path>' if False else ''
    # face
    fy=238+face_dy
    for x in (146,214):
        if eyes=='sleepy':
            svg+=f'<path d="M{x-8} {fy-1} Q{x} {fy+6} {x+8} {fy-1}" stroke="{EYE}" stroke-width="3.2" fill="none" stroke-linecap="round"></path>'
        elif eyes=='happy':
            svg+=f'<path d="M{x-8} {fy+3} Q{x} {fy-7} {x+8} {fy+3}" stroke="{EYE}" stroke-width="3.2" fill="none" stroke-linecap="round"></path>'
        else:
            svg+=f'<ellipse cx="{x}" cy="{fy}" rx="6.5" ry="7.2" fill="{EYE}"></ellipse>'
    if mouth=='smile':
        svg+=f'<path d="M170.5 {fy+11} Q180 {fy+20.5} 189.5 {fy+11} Q180 {fy+16.5} 170.5 {fy+11} Z" fill="{EYE}" stroke="{EYE}" stroke-width="1.4" stroke-linejoin="round"></path>'
    else:
        svg+=f'<path d="M173 {fy+15} Q180 {fy+16.5} 187 {fy+15}" stroke="{EYE}" stroke-width="3" fill="none" stroke-linecap="round"></path>'
    if blush:
        for x in (124,236):
            svg+=f'<ellipse cx="{x}" cy="{fy+22}" rx="15" ry="8.5" fill="{BLUSH}" opacity="0.6"></ellipse>'
    # paws tucked
    for cx in ((180-feet_dx,180+feet_dx) if paws not in ('merged','curl') else ()):
        pp=ellipse_poly(cx,by-6,paw_r[0],paw_r[1])
        po=offset(pp,cw[0]*0.9,cw[1]*0.8)
        def ar(p): return abs(sum(p[i][0]*p[(i+1)%len(p)][1]-p[(i+1)%len(p)][0]*p[i][1] for i in range(len(p))))/2
        if ar(po)<ar(pp): po=offset(pp,-cw[0]*0.9,-cw[1]*0.8)
        svg+=f'<path d="{pathd(po)}" fill="{CONTOUR}"></path>'
        svg+=f'<path d="{pathd(pp)}" fill="{body}"></path>'
    return svg


# ---------------------------------------------------------------------------
# Locked design D2 (see docs/noggin-character.md)
# ---------------------------------------------------------------------------
PALETTES = {
    "mustard": dict(body="#EDBE5A", contour="#4A3D36", shade="#D9A640",
                    hi="#F6D88E", blush="#E8906E", eye="#2E2622"),
}

# Grooves: (centre x, centre y, angle deg, length, curve amplitude, kind).
# Each starts exactly in a valley between two lobes; "_e" means it tapers
# from thick at the outline to a point inside.
D2_GROOVES = [(118.3, 179.5, 56.9, 16, 1.5, "c_e"),
              (241.7, 179.5, 123.1, 16, -1.5, "c_e"),
              (179.9, 165.1, 90.0, 11, 1.0, "c_e")]

D2 = dict(
    shape=dict(bumps=2, depths=[13] * 4, notch=7),   # four soft lobes, faint centre dip
    smooth=4,                                        # rounds the dips between lobes
    cw=(3.2, 6.6),                                   # contour weight: top, bottom
    paws="curl", crease=250, curl_w=3.8,             # continuous paw line curling over each paw
    feet_dx=50, paw_r=(22, 13.5),                    # paws planted wide
    highlights=1, hi_pos=(140, 204),                 # one matte highlight, no sparkle
    squigs=D2_GROOVES,
    blush=False,                                     # blush is a player cosmetic
)

EXPRESSIONS = {
    "calm":   dict(eyes="open",   mouth="flat"),
    "happy":  dict(eyes="happy",  mouth="smile"),
    "sleepy": dict(eyes="sleepy", mouth="flat"),
}

def draw(expression="calm", palette="mustard", **overrides):
    """Returns a complete standalone SVG string."""
    global CONTOUR, SHADE, HI, BLUSH, EYE
    p = PALETTES[palette]
    CONTOUR, SHADE, HI, BLUSH, EYE = p["contour"], p["shade"], p["hi"], p["blush"], p["eye"]
    opts = dict(D2); opts.update(EXPRESSIONS[expression]); opts.update(overrides)
    inner = art(uid=expression, **opts).replace("{{body}}", p["body"])
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="30 100 300 255" '
            'width="600" height="510" role="img" aria-label="Noggin, ' + expression + '">' + inner + '</svg>')

if __name__ == "__main__":
    if "--list" in sys.argv:
        print("expressions:", ", ".join(EXPRESSIONS)); print("palettes:", ", ".join(PALETTES)); sys.exit()
    for e in EXPRESSIONS:
        open(f"noggin-{e}.svg", "w").write(draw(e))
        print("wrote", f"noggin-{e}.svg")
