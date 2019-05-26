//Triangle Grid Experiment
let planeGeo = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, Math.sqrt(fftSize-10), Math.sqrt(fftSize-10));
let planeMaterial = new THREE.MeshLambertMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
let plane = new THREE.Mesh(planeGeo, planeMaterial);

plane.rotation.set(4.5, 0, 0);
plane.receiveShadow = true;
planeMaterial.wireframe = true;

let boxGeo = new THREE.BoxGeometry(window.innerWidth*2, window.innerHeight*1.5, 1, Math.sqrt(fftSize-64), Math.sqrt(fftSize-64));
let boxMaterial = new THREE.MeshLambertMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
let boxPlane = new THREE.Mesh(boxGeo, boxMaterial);

boxPlane.rotation.set(6*Math.PI/6, 0, 0);
boxPlane.position.set(0, window.innerWidth*1.5, window.innerHeight/1.3);
boxPlane.receiveShadow = true;
boxMaterial.wireframe = false;


let boxRoofGeo = new THREE.BoxGeometry(window.innerWidth*2, window.innerHeight*3, 1, Math.sqrt(fftSize-64), Math.sqrt(fftSize-64));
let boxRoofMaterial = new THREE.MeshLambertMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
let boxPlaneRoof = new THREE.Mesh(boxRoofGeo, boxRoofMaterial);

boxPlaneRoof.position.set(0, window.innerWidth*1.5, -window.innerHeight/1.3);
boxPlaneRoof.rotation.set(Math.PI/6, 0, 0);
boxPlaneRoof.receiveShadow = true;
boxPlaneRoof.wireframe = true;






