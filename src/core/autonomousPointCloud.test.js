import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { AutonomousPointRig, PointCloudTransition } from './autonomousPointCloud.js';
import { createMediaPipeGeometry } from './mediaPipePointCloud.js';

const references = () => Array.from({length:468},(_,i)=>new THREE.Vector3((i%22-11)*.5,(Math.floor(i/22)-10)*.5,2));

test('autonomous skin samples preserve relative and absolute morph deformation through the canonical transform', () => {
  for (const relative of [true,false]) {
    const source = new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute([-2,-2,0,2,-2,0,0,2,0],3));
    source.morphTargetsRelative=relative;
    source.morphAttributes.position=[new THREE.Float32BufferAttribute(relative ? [0,.5,0,0,.5,0,0,.5,0] : [-2,-1.5,0,2,-1.5,0,0,2.5,0],3)];
    const original=Array.from(source.attributes.position.array);
    const rig=new AutonomousPointRig(source,new THREE.Matrix4().makeScale(2,3,4).setPosition(1,-2,5),references());
    const points=createMediaPipeGeometry();rig.update(points,[0]);const before=points.attributes.position.array.slice();
    rig.update(points,[.5]);assert.equal(points.drawRange.count,3);
    for(let i=0;i<3;i++) {
      assert.equal(points.attributes.position.getX(i),before[i*3]);
      assert.ok(Math.abs(points.attributes.position.getY(i)-before[i*3+1]-.75)<1e-6);
      assert.equal(points.attributes.position.getZ(i),before[i*3+2]);
    }
    assert.deepEqual(Array.from(source.attributes.position.array),original);
  }
});

test('autonomous distribution covers the face uniformly and excludes rear-facing or non-face vertices', () => {
  const positions=[],normals=[],weights=[];
  for(let x=-6;x<=6;x+=.5)for(let y=-7;y<=7;y+=.5){
    positions.push(x,y,2,x,y,4);normals.push(0,0,1,0,0,-1);weights.push(1,1);
  }
  for(let i=0;i<30;i++){positions.push(i,20,8);normals.push(0,0,1);weights.push(0);}
  const source=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
    .setAttribute('normal',new THREE.Float32BufferAttribute(normals,3)).setAttribute('photoWeight',new THREE.Float32BufferAttribute(weights,1));
  const rig=new AutonomousPointRig(source,new THREE.Matrix4(),references()),points=createMediaPipeGeometry();rig.update(points,[]);
  assert.equal(points.drawRange.count,478);
  const quadrants=[0,0,0,0],unique=new Set();
  for(let i=0;i<478;i++){
    const x=points.attributes.position.getX(i),y=points.attributes.position.getY(i);
    assert.equal(points.attributes.position.getZ(i),2);
    assert.ok(Math.abs(x)<=6&&Math.abs(y)<=7);
    unique.add(`${x},${y}`);quadrants[(x>=0?1:0)+(y>=0?2:0)]++;
  }
  assert.equal(unique.size,478);
  assert.ok(quadrants.every(count=>count>=85&&count<=155));
});

test('the open-eye rims remain legible even where eyelid normals face into the socket', () => {
  const positions=[],normals=[],deltas=[],indices=[],rim=[];
  const refs=references();refs[33].set(-4,2.6,4);refs[133].set(-2,2.6,4);
  refs[362].set(2,2.6,4);refs[263].set(4,2.6,4);
  for(const center of [-3,3]) {
    const start=positions.length/3;
    for(let ring=0;ring<2;ring++)for(let i=0;i<24;i++) {
      const angle=2*Math.PI*i/24,x=center+Math.cos(angle)*(ring?1.5:1),y=2.6+Math.sin(angle)*(ring?.95:.35);
      positions.push(x,y,4);normals.push(0,0,ring?1:-1);deltas.push(0,ring?0:2.6-y,0);
      if(!ring)rim.push(new THREE.Vector3(x,y,4));
    }
    for(let i=0;i<24;i++) {
      const a=start+i,b=start+(i+1)%24,c=a+24,d=b+24;
      indices.push(a,c,b,b,c,d);
    }
  }
  const source=new THREE.BufferGeometry().setIndex(indices)
    .setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
    .setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
  source.morphTargetsRelative=true;source.morphAttributes.position=[new THREE.Float32BufferAttribute(deltas,3)];
  const rig=new AutonomousPointRig(source,new THREE.Matrix4(),refs),points=createMediaPipeGeometry();rig.update(points,[0]);
  const slots=rim.map(point=>{
    for(let i=0;i<rig.count;i++)if(new THREE.Vector3().fromBufferAttribute(points.attributes.position,i).distanceTo(point)<1e-5)return i;
    assert.fail('a point on the eye opening was omitted');
  });
  rig.update(points,[1]);
  for(const slot of slots)assert.ok(Math.abs(points.attributes.position.getY(slot)-2.6)<1e-5,'the eyelid contour must follow the blink');
});

test('point identities ease across Live/preset switches and interruptions in half a second', () => {
  const geometry = createMediaPipeGeometry(), transition = new PointCloudTransition();
  const show = (value,kind,now) => {
    geometry.attributes.position.array.fill(value);
    transition.update(geometry,kind,now,500);
    return geometry.attributes.position.getX(0);
  };
  assert.equal(show(0,'live',0),0);
  assert.equal(show(10,'preset',100),0);
  assert.equal(show(10,'preset',350),5);
  assert.equal(show(2,'live',375),5,'an interrupted transition must retain the last displayed shape');
  assert.equal(show(2,'live',625),3.5);
  assert.equal(show(2,'live',875),2);
  assert.equal(show(9,'preset',900),2);
  assert.equal(show(9,'preset',1400),9);
  assert.equal(show(12,'preset',1500),12,'preset expression handoffs are already handled by the shared morph blend');
});
