// Very simple FPS-style physics with AABB player and static AABB world.


export class AABB{ constructor(min,max){ this.min=min; this.max=max; } }


export function aabbOverlap(a,b){
return (a.min.x <= b.max.x && a.max.x >= b.min.x &&
a.min.y <= b.max.y && a.max.y >= b.min.y &&
a.min.z <= b.max.z && a.max.z >= b.min.z);
}


export function resolveAabbVsStatic(playerBox, vel, statics){
// Swept is skipped for simplicity; resolve axis by axis
let onGround = false;
for(const s of statics){
if(!aabbOverlap(playerBox, s)) continue;
const penX = Math.min(playerBox.max.x - s.min.x, s.max.x - playerBox.min.x);
const penY = Math.min(playerBox.max.y - s.min.y, s.max.y - playerBox.min.y);
const penZ = Math.min(playerBox.max.z - s.min.z, s.max.z - playerBox.min.z);
if(penX < penY && penX < penZ){ // x
if(playerBox.max.x - s.min.x < s.max.x - playerBox.min.x){
playerBox.min.x -= penX; playerBox.max.x -= penX;
} else { playerBox.min.x += penX; playerBox.max.x += penX; }
vel.x = 0;
} else if(penY < penZ){ // y
if(playerBox.max.y - s.min.y < s.max.y - playerBox.min.y){
playerBox.min.y -= penY; playerBox.max.y -= penY;
onGround = true; // collided from top
} else { playerBox.min.y += penY; playerBox.max.y += penY; }
vel.y = 0;
} else { // z
if(playerBox.max.z - s.min.z < s.max.z - playerBox.min.z){
playerBox.min.z -= penZ; playerBox.max.z -= penZ;
} else { playerBox.min.z += penZ; playerBox.max.z += penZ; }
vel.z = 0;
}
}
return onGround;
}


export function makePlayerBox(pos){
const halfW=0.4, halfD=0.4, h=1.8;
return new AABB(new Vec3(pos.x-halfW, pos.y, pos.z-halfD), new Vec3(pos.x+halfW, pos.y+h, pos.z+halfD));
}


export function centerOf(box){
return new Vec3((box.min.x+box.max.x)/2, box.min.y, (box.min.z+box.max.z)/2);
}


export function rayAabb(origin, dir, box){
// Fast ray vs AABB test, return distance or null
const inv = new Vec3(1/(dir.x||1e-9), 1/(dir.y||1e-9), 1/(dir.z||1e-9));
let t1=(box.min.x-origin.x)*inv.x, t2=(box.max.x-origin.x)*inv.x;
let tmin=Math.min(t1,t2), tmax=Math.max(t1,t2);
t1=(box.min.y-origin.y)*inv.y; t2=(box.max.y-origin.y)*inv.y;
tmin=Math.max(tmin, Math.min(t1,t2)); tmax=Math.min(tmax, Math.max(t1,t2));
t1=(box.min.z-origin.z)*inv.z; t2=(box.max.z-origin.z)*inv.z;
tmin=Math.max(tmin, Math.min(t1,t2)); tmax=Math.min(tmax, Math.max(t1,t2));
if(tmax>=Math.max(0,tmin)) return tmin>0?tmin:0; return null;
}
