import { useState, useEffect, useRef } from "react";

const W = 64, H = 32, ELEV_H = 7;
const toIso = (x, y) => ({ sx: (x - y) * (W / 2), sy: (x + y) * (H / 2) });
const MAP_W = 16, MAP_H = 12;

const TERRAIN = [
  [0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,0,0,2,2,0,0,0,0,3,3,0],
  [0,1,1,0,0,2,2,2,2,2,0,0,3,3,3,0],
  [0,0,0,0,0,2,2,0,0,2,2,0,0,3,3,0],
  [1,1,0,0,2,2,2,0,0,0,2,2,0,0,3,0],
  [1,1,0,0,2,2,0,0,0,0,0,2,2,0,3,3],
  [0,0,0,0,0,0,0,4,4,0,0,0,2,0,3,3],
  [0,0,0,0,0,0,0,4,4,4,0,0,0,0,3,3],
  [0,0,0,0,0,0,0,0,4,4,4,0,5,5,3,3],
  [0,0,0,0,0,0,0,0,0,4,5,5,5,5,5,3],
  [0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5],
  [0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5],
];

const ELEVATION = [
  [0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,2,2,1,0,0,3,4,2,0,0,0,2,3,1],
  [0,1,2,0,0,2,3,4,5,4,2,0,1,3,4,2],
  [0,0,0,0,0,2,4,2,1,3,4,1,0,3,4,2],
  [1,2,1,0,2,3,5,2,0,0,3,4,1,1,3,1],
  [1,2,1,0,2,4,3,1,0,0,1,3,4,1,3,3],
  [0,0,0,0,1,2,1,0,0,0,0,2,3,1,3,4],
  [0,0,0,0,0,1,0,0,0,0,0,1,2,1,3,4],
  [0,0,0,0,0,0,0,0,0,0,1,1,2,3,4,4],
  [0,0,0,0,0,0,0,0,0,0,2,3,3,4,5,4],
  [0,0,0,0,0,0,0,0,0,0,2,3,4,5,5,4],
  [0,0,0,0,0,0,0,0,0,0,1,2,3,4,4,3],
];

const TC = {
  0:{ top:"#4a8c3f", left:"#2e5c28", right:"#3d7a33" },
  1:{ top:"#6b8f4a", left:"#3f5c2a", right:"#5a7d3c" },
  2:{ top:"#8a8a9a", left:"#4a4a58", right:"#6a6a7a" },
  3:{ top:"#2a1a1a", left:"#1a0e0e", right:"#221414" },
  4:{ top:"#8a9a5a", left:"#4f5c30", right:"#70824a" },
  5:{ top:"#3a2a2a", left:"#221818", right:"#2e2020" },
};

const LOCATIONS = [
  { id:"shire",    name:"The Shire",     x:2,  y:4,  icon:"🏡", color:"#7ec850", desc:"Peaceful homeland of the Hobbits, nestled in green rolling hills." },
  { id:"rivendell",name:"Rivendell",     x:7,  y:2,  icon:"✨", color:"#a8d8ea", desc:"The Last Homely House, a hidden valley of Elven grace and wisdom." },
  { id:"mordor",   name:"Mordor",        x:14, y:9,  icon:"🌋", color:"#c0392b", desc:"The dark land of Sauron, shrouded in ash and shadow." },
  { id:"gondor",   name:"Minas Tirith",  x:12, y:7,  icon:"🏰", color:"#c2a366", desc:"The great white city, seat of the Kingdom of Gondor." },
  { id:"rohan",    name:"Rohan",         x:9,  y:6,  icon:"🐴", color:"#d4a843", desc:"The kingdom of the horse-lords, a vast golden plain." },
  { id:"moria",    name:"Moria",         x:5,  y:5,  icon:"⛏️", color:"#7a7a8a", desc:"The ancient Dwarven kingdom beneath the Misty Mountains." },
  { id:"lothl",    name:"Lothlórien",    x:7,  y:6,  icon:"🌳", color:"#6abf69", desc:"A golden forest of grace, ruled by the Lady Galadriel." },
  { id:"isengard", name:"Isengard",      x:8,  y:5,  icon:"🗼", color:"#5a6a5a", desc:"Saruman's fortress, once a place of learning, now ruined." },
  { id:"helm",     name:"Helm's Deep",   x:10, y:6,  icon:"🛡️", color:"#8899aa", desc:"A mighty fortress where a legendary battle was fought." },
  { id:"bree",     name:"Bree",          x:4,  y:3,  icon:"🍺", color:"#b8860b", desc:"A small crossroads town, home to the Prancing Pony inn." },
  { id:"edoras",   name:"Edoras",        x:9,  y:5,  icon:"🏠", color:"#c9a84c", desc:"The capital of Rohan, set atop a solitary hill." },
  { id:"dol",      name:"Dol Guldur",    x:10, y:3,  icon:"💀", color:"#4a3040", desc:"A fortress of dark sorcery hidden in Mirkwood." },
  { id:"erebor",   name:"Erebor",        x:13, y:1,  icon:"⛰️", color:"#c9a070", desc:"The Lonely Mountain, ancient home of the Dwarves." },
  { id:"lake",     name:"Lake-town",     x:13, y:2,  icon:"🏘️", color:"#4a90b8", desc:"A prosperous town on the shores of the Long Lake." },
  { id:"dead",     name:"Dead Marshes",  x:11, y:8,  icon:"🌫️", color:"#7a9a6a", desc:"Eerie wetlands haunted by the faces of the fallen." },
  { id:"pelargir", name:"Pelargir",      x:13, y:8,  icon:"⛵", color:"#5588aa", desc:"A great harbor city on the shores of the Anduin." },
];

// Rivers: waypoints in tile coords; elevation is respected at draw time.
const RIVERS = [
  {
    name: "The Anduin",
    color: "#4a9abe",
    points: [[8,2],[8,3],[8,4],[8,5],[9,6],[9,7],[10,7],[10,8],[11,8],[11,9],[12,9],[12,10],[13,10],[13,11]]
  },
  {
    name: "Brandywine",
    color: "#5aadcc",
    points: [[1,3],[2,4],[2,5],[3,6],[3,7]]
  },
  {
    name: "River Running",
    color: "#4a9abe",
    points: [[13,0],[13,1],[13,2],[12,3],[12,4]]
  },
  {
    name: "Sirannon",
    color: "#5aadcc",
    points: [[5,4],[5,5],[6,6],[6,7],[7,8]]
  },
];

export default function MiddleEarthMap() {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 60 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const zoom = 1.15;

  // Eye tracking: raw mouse in page coords, and a smoothly lerped version
  const mouseRef = useRef({ x: 450, y: 310 });
  const eyeLerp  = useRef({ x: 450, y: 310 });

  useEffect(() => {
    const onMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTime(t => t + 0.02), 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cw = canvas.width = 900;
    const ch = canvas.height = 620;
    ctx.clearRect(0, 0, cw, ch);

    // ── Sky ──
    const sky = ctx.createLinearGradient(0, 0, 0, ch);
    sky.addColorStop(0, "#120a1e");
    sky.addColorStop(0.55, "#1e1430");
    sky.addColorStop(1, "#161020");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, cw, ch);

    // Stars
    for (let i = 0; i < 140; i++) {
      const sx = (i * 137.5 + 50) % cw;
      const sy = (i * 97.3 + 20) % (ch * 0.45);
      const a = 0.25 + 0.45 * Math.sin(time * 1.8 + i * 0.7);
      ctx.fillStyle = `rgba(240,235,220,${a})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.7 + (i % 3) * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }

    const originX = cw / 2 + offset.x;
    const originY = 70 + offset.y;

    // ── Lerp eye toward mouse (in page coords) ──
    const L = 0.055;
    eyeLerp.current.x += (mouseRef.current.x - eyeLerp.current.x) * L;
    eyeLerp.current.y += (mouseRef.current.y - eyeLerp.current.y) * L;

    // Convert lerped page pos → canvas coords
    const rect = canvas.getBoundingClientRect();
    const scX = cw / rect.width;
    const scY = ch / rect.height;
    const mouseCx = (eyeLerp.current.x - rect.left) * scX;
    const mouseCy = (eyeLerp.current.y - rect.top) * scY;

    // Convert canvas coords → world coords (undo translate + scale)
    const mouseWorldX = (mouseCx - originX) / zoom;
    const mouseWorldY = (mouseCy - originY) / zoom;

    // ── Enter world space ──
    ctx.save();
    ctx.translate(originX, originY);
    ctx.scale(zoom, zoom);

    // ── Build & sort tiles ──
    const tiles = [];
    for (let y = 0; y < MAP_H; y++)
      for (let x = 0; x < MAP_W; x++) {
        const iso = toIso(x, y);
        tiles.push({ x, y, sx: iso.sx, sy: iso.sy, t: TERRAIN[y][x], elev: ELEVATION[y][x] });
      }
    tiles.sort((a, b) => (a.sy - b.sy) || (a.sx - b.sx) || (a.elev - b.elev));

    // ── Draw tiles ──
    tiles.forEach(({ x, y, sx, sy, t, elev }) => {
      const c = TC[t];
      const h = elev * ELEV_H;
      const tw = W, th = H;

      // Left wall
      if (h > 0) {
        ctx.fillStyle = c.left;
        ctx.beginPath();
        ctx.moveTo(sx, sy); ctx.lineTo(sx+tw/2, sy+th/2);
        ctx.lineTo(sx+tw/2, sy+th/2+h); ctx.lineTo(sx, sy+h);
        ctx.closePath(); ctx.fill();
        const lw = ctx.createLinearGradient(sx, sy, sx+tw/2, sy+th/2);
        lw.addColorStop(0,"rgba(255,255,255,0.06)");
        lw.addColorStop(0.4,"rgba(255,255,255,0)");
        lw.addColorStop(1,"rgba(0,0,0,0.12)");
        ctx.fillStyle = lw;
        ctx.beginPath();
        ctx.moveTo(sx, sy); ctx.lineTo(sx+tw/2, sy+th/2);
        ctx.lineTo(sx+tw/2, sy+th/2+h); ctx.lineTo(sx, sy+h);
        ctx.closePath(); ctx.fill();
      }
      // Right wall
      if (h > 0) {
        ctx.fillStyle = c.right;
        ctx.beginPath();
        ctx.moveTo(sx+tw, sy); ctx.lineTo(sx+tw/2, sy+th/2);
        ctx.lineTo(sx+tw/2, sy+th/2+h); ctx.lineTo(sx+tw, sy+h);
        ctx.closePath(); ctx.fill();
        const rw = ctx.createLinearGradient(sx+tw, sy, sx+tw/2, sy+th/2);
        rw.addColorStop(0,"rgba(0,0,0,0.05)");
        rw.addColorStop(1,"rgba(0,0,0,0.18)");
        ctx.fillStyle = rw;
        ctx.beginPath();
        ctx.moveTo(sx+tw, sy); ctx.lineTo(sx+tw/2, sy+th/2);
        ctx.lineTo(sx+tw/2, sy+th/2+h); ctx.lineTo(sx+tw, sy+h);
        ctx.closePath(); ctx.fill();
      }

      // Top face
      const tsy = sy - h;
      ctx.fillStyle = c.top;
      ctx.beginPath();
      ctx.moveTo(sx, tsy); ctx.lineTo(sx+tw/2, tsy+th/2);
      ctx.lineTo(sx+tw, tsy); ctx.lineTo(sx+tw/2, tsy-th/2);
      ctx.closePath(); ctx.fill();

      // Light on top
      const tg = ctx.createLinearGradient(sx, tsy-th/2, sx+tw, tsy+th/2);
      tg.addColorStop(0,"rgba(255,255,240,0.11)");
      tg.addColorStop(0.5,"rgba(255,255,240,0.03)");
      tg.addColorStop(1,"rgba(0,0,0,0.08)");
      ctx.fillStyle = tg;
      ctx.beginPath();
      ctx.moveTo(sx, tsy); ctx.lineTo(sx+tw/2, tsy+th/2);
      ctx.lineTo(sx+tw, tsy); ctx.lineTo(sx+tw/2, tsy-th/2);
      ctx.closePath(); ctx.fill();

      // Decorations
      if (t === 2 && elev >= 3) {
        const pH = 14 + elev*2;
        ctx.fillStyle = "#7a8090";
        ctx.beginPath();
        ctx.moveTo(sx+tw*0.28, tsy+2); ctx.lineTo(sx+tw*0.5, tsy-pH); ctx.lineTo(sx+tw*0.72, tsy+2);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#eef0f4";
        ctx.beginPath();
        ctx.moveTo(sx+tw*0.42, tsy-pH+5); ctx.lineTo(sx+tw*0.5, tsy-pH); ctx.lineTo(sx+tw*0.58, tsy-pH+5);
        ctx.closePath(); ctx.fill();
      } else if (t === 2) {
        ctx.fillStyle = "#6e7080";
        ctx.beginPath();
        ctx.moveTo(sx+tw*0.33, tsy+1); ctx.lineTo(sx+tw*0.5, tsy-9); ctx.lineTo(sx+tw*0.67, tsy+1);
        ctx.closePath(); ctx.fill();
      }
      if (t === 1) {
        ctx.fillStyle = "#577d3a";
        ctx.beginPath(); ctx.ellipse(sx+tw*0.35, tsy-1, tw*0.14, th*0.11, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#4e7234";
        ctx.beginPath(); ctx.ellipse(sx+tw*0.62, tsy+2, tw*0.11, th*0.09, 0, 0, Math.PI*2); ctx.fill();
      }
      if (t === 0 && (x*7+y*13)%5 < 2) {
        ctx.fillStyle = "#2a5526";
        ctx.beginPath();
        ctx.moveTo(sx+tw*0.65, tsy); ctx.lineTo(sx+tw*0.7, tsy-11); ctx.lineTo(sx+tw*0.75, tsy);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#336b2e";
        ctx.beginPath();
        ctx.moveTo(sx+tw*0.4, tsy+1); ctx.lineTo(sx+tw*0.44, tsy-7); ctx.lineTo(sx+tw*0.48, tsy+1);
        ctx.closePath(); ctx.fill();
      }
      if (t === 3 || t === 5) {
        for (let s = 0; s < 2; s++) {
          const a = 0.07+0.05*Math.sin(time*2.5+x+y*2+s*2);
          const ox = tw*(0.3+s*0.25)+Math.sin(time+s)*3;
          ctx.fillStyle = `rgba(180,50,10,${a})`;
          ctx.beginPath(); ctx.ellipse(sx+ox, tsy-3-s*2, tw*0.22, th*0.16, 0, 0, Math.PI*2); ctx.fill();
        }
      }
      if (t === 4) {
        ctx.fillStyle = "#6e8a40";
        ctx.beginPath();
        ctx.moveTo(sx+tw*0.55, tsy+1); ctx.lineTo(sx+tw*0.52, tsy-4);
        ctx.lineTo(sx+tw*0.58, tsy-3); ctx.lineTo(sx+tw*0.6, tsy+1);
        ctx.closePath(); ctx.fill();
      }
    });

    // ── Rivers ──
    // Helper: tile [x,y] → world-space point on top-face center, respecting elevation
    const tileToWorld = (tx, ty) => {
      const iso = toIso(tx, ty);
      const elev = (ELEVATION[ty] && ELEVATION[ty][tx]) || 0;
      return { x: iso.sx + W / 2, y: iso.sy - elev * ELEV_H };
    };

    RIVERS.forEach((river) => {
      // Convert waypoints to world coords
      const pts = river.points.map(([tx, ty]) => tileToWorld(tx, ty));
      if (pts.length < 2) return;

      // Build a smooth catmull-rom style path using quadratic curves between midpoints
      // We'll use a helper that generates a series of quadratic segments
      const buildPath = (ctx, pts) => {
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 0; i < pts.length - 1; i++) {
          const mid = { x: (pts[i].x + pts[i+1].x) / 2, y: (pts[i].y + pts[i+1].y) / 2 };
          if (i === 0) {
            ctx.lineTo(mid.x, mid.y);
          } else {
            const prev = { x: (pts[i-1].x + pts[i].x)/2, y: (pts[i-1].y + pts[i].y)/2 };
            ctx.quadraticCurveTo(pts[i].x, pts[i].y, mid.x, mid.y);
          }
        }
        // finish to last point
        ctx.lineTo(pts[pts.length-1].x, pts[pts.length-1].y);
      };

      // Reduce overall river opacity by 30%
      ctx.save();
      ctx.globalAlpha = 0.49;

      // 1) Dark shadow under the river
      ctx.save();
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      buildPath(ctx, pts.map(p => ({ x: p.x + 1, y: p.y + 2 })));
      ctx.stroke();
      ctx.restore();

      // 2) Main river body
      ctx.save();
      // Animated gradient along the river using the time offset
      // We create a gradient perpendicular-ish to give the water depth
      const x0 = pts[0].x, y0 = pts[0].y;
      const xN = pts[pts.length-1].x, yN = pts[pts.length-1].y;
      const rg = ctx.createLinearGradient(x0, y0, xN, yN);
      // Animate the color stops slightly with time for a living feel
      const shimmerOffset = (Math.sin(time * 1.2) * 0.08 + 0.08);
      rg.addColorStop(0,           "#2a6a8a");
      rg.addColorStop(0.3 + shimmerOffset, "#4a9abe");
      rg.addColorStop(0.5,         "#3d85a8");
      rg.addColorStop(0.7 - shimmerOffset, "#5aadcc");
      rg.addColorStop(1,           "#2a6a8a");

      ctx.strokeStyle = rg;
      ctx.lineWidth = 5.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      buildPath(ctx, pts);
      ctx.stroke();

      // 3) Bright highlight pass — thinner, offset slightly, animated alpha
      ctx.strokeStyle = `rgba(140, 210, 240, ${0.25 + 0.15 * Math.sin(time * 2.1)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      // shift highlight slightly to simulate light hitting the surface
      buildPath(ctx, pts.map(p => ({ x: p.x - 0.8, y: p.y - 1.2 })));
      ctx.stroke();

      // 4) Animated shimmer dots along the river
      for (let i = 0; i < pts.length - 1; i++) {
        // Place 2 shimmer dots per segment
        for (let s = 0; s < 2; s++) {
          const frac = (s + 0.25) / 2;
          const sx = pts[i].x + (pts[i+1].x - pts[i].x) * frac;
          const sy = pts[i].y + (pts[i+1].y - pts[i].y) * frac;
          // Phase each dot differently so they twinkle at different times
          const phase = (time * 2.5 + i * 1.7 + s * 2.3) % (Math.PI * 2);
          const alpha = Math.max(0, Math.sin(phase)) * 0.7;
          ctx.fillStyle = `rgba(180, 230, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore(); // end shimmer dots save
      ctx.restore(); // end globalAlpha 0.7
    });

    // ── Location pins ──
    const sortedLocs = [...LOCATIONS].sort((a, b) => {
      const ay = toIso(a.x, a.y).sy - (ELEVATION[a.y]?.[a.x]||0)*ELEV_H;
      const by = toIso(b.x, b.y).sy - (ELEVATION[b.y]?.[b.x]||0)*ELEV_H;
      return ay - by;
    });
    sortedLocs.forEach(loc => {
      const iso = toIso(loc.x, loc.y);
      const elev = ELEVATION[loc.y]?.[loc.x] || 0;
      const px = iso.sx + W/2;
      const py = iso.sy - elev*ELEV_H - 6;
      const isHov = hovered === loc.id;
      const pulse = isHov ? Math.sin(time*6)*2.5 : 0;

      const gs = isHov ? 20 : 13;
      const glow = ctx.createRadialGradient(px, py, 0, px, py, gs+pulse);
      glow.addColorStop(0, loc.color+"55"); glow.addColorStop(1, loc.color+"00");
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(px, py, gs+pulse, 0, Math.PI*2); ctx.fill();

      ctx.strokeStyle = loc.color; ctx.lineWidth = 1.8; ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py+11); ctx.stroke();
      ctx.globalAlpha = 1;

      const r = isHov ? 9 : 7;
      ctx.fillStyle = isHov ? "#fff" : loc.color;
      ctx.beginPath(); ctx.arc(px, py-r-1, r, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = loc.color; ctx.lineWidth = 2.2; ctx.stroke();

      ctx.font = `${isHov?10:8}px sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(loc.icon, px, py-r-1);

      if (isHov) {
        ctx.font = "bold 11px 'Palatino Linotype', serif";
        ctx.textAlign = "center"; ctx.fillStyle = "#fff";
        ctx.shadowColor = "rgba(0,0,0,0.9)"; ctx.shadowBlur = 7;
        ctx.fillText(loc.name, px, py-r-21);
        ctx.shadowBlur = 0;
      }
    });

    // ── Eye of Sauron (still inside world-space transform) ──
    {
      // Anchor: float above Mordor tile (14, 9)
      const eyeTile = toIso(14, 9);
      const eyeElev = ELEVATION[9][14];
      const eCX = eyeTile.sx + W/2;
      const eCY = eyeTile.sy - eyeElev * ELEV_H - 55;

      // Angle from eye center to mouse (both in world coords now)
      const dx = mouseWorldX - eCX;
      const dy = mouseWorldY - eCY;
      const angle = Math.atan2(dy, dx);

      const pulse = 1 + 0.04 * Math.sin(time * 3.2);
      const eW = 40 * pulse;   // eye half-width
      const eH = 19 * pulse;   // eye half-height

      ctx.save();
      ctx.translate(eCX, eCY);

      // Outer pulsing glow rings
      for (let ring = 3; ring >= 0; ring--) {
        const phase = (time * 0.8 + ring * 0.35) % 1;
        const rS = 1 + phase * 0.55;
        const rA = (1 - phase) * (0.2 - ring * 0.04);
        ctx.strokeStyle = `rgba(220,80,10,${rA})`;
        ctx.lineWidth = 2.4 - ring * 0.4;
        ctx.beginPath();
        ctx.ellipse(0, 0, eW*rS + ring*7, eH*rS + ring*5, 0, 0, Math.PI*2);
        ctx.stroke();
      }

      // Big soft radial fire glow behind
      const fg = ctx.createRadialGradient(0, 0, eH*0.2, 0, 0, eW*1.8);
      fg.addColorStop(0,  "rgba(255,140,20,0.38)");
      fg.addColorStop(0.4,"rgba(200,60,10,0.2)");
      fg.addColorStop(1,  "rgba(180,40,5,0)");
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.ellipse(0, 0, eW*1.8, eH*1.8, 0, 0, Math.PI*2); ctx.fill();

      // Radiating rays (behind everything via screen blend)
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < 14; i++) {
        const ra = (i/14)*Math.PI*2 + time*0.22;
        const rAlpha = 0.07 + 0.06*Math.sin(time*2.4 + i*1.1);
        ctx.strokeStyle = `rgba(220,90,15,${rAlpha})`;
        ctx.lineWidth = 1.3 + Math.sin(time*3+i)*0.7;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ra)*eW*0.4, Math.sin(ra)*eH*0.4);
        ctx.lineTo(Math.cos(ra)*eW*3.0, Math.sin(ra)*eH*3.0);
        ctx.stroke();
      }
      ctx.restore();

      // Eye body (molten radial)
      const eb = ctx.createRadialGradient(0, 0, 0, 0, 0, eW);
      eb.addColorStop(0,   "#ffaa33");
      eb.addColorStop(0.35,"#cc5500");
      eb.addColorStop(0.7, "#5a1500");
      eb.addColorStop(1,   "#1a0500");
      ctx.fillStyle = eb;
      ctx.beginPath(); ctx.ellipse(0, 0, eW, eH, 0, 0, Math.PI*2); ctx.fill();

      // Bright flickering core
      const flick = 0.75 + 0.25*Math.sin(time*7.1+1.3);
      const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, eH*0.7*flick);
      cg.addColorStop(0,   `rgba(255,220,80,${0.6*flick})`);
      cg.addColorStop(0.5, `rgba(255,150,30,${0.3*flick})`);
      cg.addColorStop(1,   "rgba(255,100,10,0)");
      ctx.fillStyle = cg;
      ctx.beginPath(); ctx.ellipse(0, 0, eH*0.95, eH*0.58, 0, 0, Math.PI*2); ctx.fill();

      // Slit pupil — tracks cursor
      const pupilR = eH * 0.2;
      const pX = Math.cos(angle) * pupilR;
      const pY = Math.sin(angle) * pupilR;

      // pupil shadow
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.ellipse(pX+1, pY+1.5, 3.8, eH*0.54, angle, 0, Math.PI*2);
      ctx.fill();

      // pupil body
      const pg = ctx.createRadialGradient(pX, pY, 0, pX, pY, eH*0.56);
      pg.addColorStop(0,   "#000");
      pg.addColorStop(0.7, "#0a0500");
      pg.addColorStop(1,   "rgba(30,10,0,0.5)");
      ctx.fillStyle = pg;
      ctx.beginPath();
      ctx.ellipse(pX, pY, 3.8, eH*0.54, angle, 0, Math.PI*2);
      ctx.fill();

      // specular glint
      ctx.fillStyle = "rgba(255,210,110,0.4)";
      ctx.beginPath();
      ctx.ellipse(pX-1.3, pY-1.6, 1.2, 0.75, 0, 0, Math.PI*2);
      ctx.fill();

      ctx.restore(); // end eye translate
    }

    // ── Exit world space ──
    ctx.restore();

    // ── Vignette ──
    const vig = ctx.createRadialGradient(cw/2, ch/2, ch*0.28, cw/2, ch/2, ch*0.78);
    vig.addColorStop(0,"rgba(0,0,0,0)");
    vig.addColorStop(1,"rgba(0,0,0,0.55)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, cw, ch);

    // ── Title ──
    ctx.save();
    ctx.font = "33px 'Palatino Linotype','Book Antiqua',serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#d4af7a";
    ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 10;
    ctx.fillText("Middle Earth", cw/2, 40);
    ctx.font = "13px 'Palatino Linotype',serif";
    ctx.fillStyle = "#7a6a48"; ctx.shadowBlur = 6;
    ctx.fillText("— an isometric chronicle —", cw/2, 64);
    ctx.restore();

  }, [time, hovered, offset, zoom]);

  // ── Hit detection ──
  const getHitLocation = (mx, my) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const cx = (mx - rect.left) * (canvas.width / rect.width);
    const cy = (my - rect.top) * (canvas.height / rect.height);
    const originX = canvas.width/2 + offset.x;
    const originY = 70 + offset.y;
    for (const loc of LOCATIONS) {
      const iso = toIso(loc.x, loc.y);
      const elev = ELEVATION[loc.y]?.[loc.x] || 0;
      const px = (iso.sx + W/2)*zoom + originX;
      const py = (iso.sy - elev*ELEV_H - 6)*zoom + originY;
      if (Math.hypot(cx-px, cy-py) < 18) return { loc };
    }
    return null;
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setOffset({ x: offset.x+(e.clientX-dragStart.x), y: offset.y+(e.clientY-dragStart.y) });
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }
    const hit = getHitLocation(e.clientX, e.clientY);
    setHovered(hit ? hit.loc.id : null);
    setTooltip({ x: e.clientX, y: e.clientY });
  };

  const hoveredLoc = LOCATIONS.find(l => l.id === hovered);

  return (
    <div style={{
      width:"100%", height:"100vh", background:"#0c0814",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      fontFamily:"'Palatino Linotype','Book Antiqua',serif",
      overflow:"hidden", position:"relative", userSelect:"none"
    }}>
      <canvas
        ref={canvasRef}
        style={{ width:"100%", maxWidth:900, height:"auto", borderRadius:10,
          cursor: hovered ? "pointer" : dragging ? "grabbing" : "grab" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setHovered(null); setDragging(false); }}
        onMouseDown={(e) => { setDragging(true); setDragStart({ x:e.clientX, y:e.clientY }); }}
        onMouseUp={() => setDragging(false)}
      />

      {hoveredLoc && (
        <div style={{
          position:"fixed", left: tooltip.x+18, top: tooltip.y-65,
          background:"linear-gradient(140deg,#1c1228,#281d3a)", border:"1px solid #4a3a58",
          borderRadius:10, padding:"10px 15px", color:"#e8dcc8", maxWidth:230, zIndex:10,
          boxShadow:"0 6px 28px rgba(0,0,0,0.65)", pointerEvents:"none",
          animation:"fadeIn 0.15s ease"
        }}>
          <div style={{ fontWeight:"bold", fontSize:15, color:hoveredLoc.color, marginBottom:3 }}>
            {hoveredLoc.icon} {hoveredLoc.name}
            <span style={{ fontSize:10, color:"#6a5a7a", marginLeft:8, fontWeight:"normal" }}>
              Elev {ELEVATION[hoveredLoc.y]?.[hoveredLoc.x]||0}
            </span>
          </div>
          <div style={{ fontSize:12, lineHeight:1.5, color:"#a89878" }}>{hoveredLoc.desc}</div>
        </div>
      )}

      <div style={{
        position:"absolute", bottom:18, left:"50%", transform:"translateX(-50%)",
        display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center", alignItems:"center"
      }}>
        {[
          { color:"#4a8c3f", label:"Lands" },
          { color:"#6b8f4a", label:"Hills" },
          { color:"#8a8a9a", label:"Mountains" },
          { color:"#8a9a5a", label:"Plains" },
          { color:"#2a1a1a", label:"Mordor" },
          { color:"#4a9abe", label:"Rivers" },
        ].map(item => (
          <div key={item.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:11, height:11, borderRadius:3, background:item.color, border:"1px solid rgba(255,255,255,0.14)" }}/>
            <span style={{ color:"#7a6a4a", fontSize:11 }}>{item.label}</span>
          </div>
        ))}
        <span style={{ color:"#4a3a2a", fontSize:10, marginLeft:10 }}>drag to pan · hover locations</span>
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
