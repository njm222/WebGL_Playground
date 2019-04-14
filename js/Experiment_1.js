//Triangle Grid Experiment
let planeGeo = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, Math.sqrt(fftSize-10), Math.sqrt(fftSize-10));
let planeMaterial = new THREE.MeshLambertMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
let plane = new THREE.Mesh(planeGeo, planeMaterial);

plane.rotation.set(4.5, 0, 0);
plane.receiveShadow = true;
planeMaterial.wireframe = true;

let boxGeo = new THREE.BoxGeometry(window.innerWidth, window.innerHeight, 1, Math.sqrt(fftSize-64), Math.sqrt(fftSize-64));
let boxMaterial = new THREE.MeshLambertMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
let boxPlane = new THREE.Mesh(boxGeo, boxMaterial);

boxPlane.rotation.set(3*Math.PI/2, 0, 0);
boxPlane.receiveShadow = true;
boxMaterial.wireframe = true;



