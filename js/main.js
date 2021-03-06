javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

//Constants
const width = window.innerWidth;
const height = window.innerHeight;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75,width/height, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
let controls = new THREE.OrbitControls(camera);

//Light
let pointLight = new THREE.PointLight(0xff0000, 1, 100);
let light_1 = new THREE.DirectionalLight(0xffffff);
let light_2 = new THREE.AmbientLight();

//Material and colour
let colour = new THREE.Color("rgb(256,256,256)");
let basicMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
let lambertMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
let depthMaterial = new THREE.MeshDepthMaterial( { wireframe: true } );

let groundMaterial = new THREE.MeshPhongMaterial( {
    color: 0xa0adaf,
    shininess: 150,
    specular: 0x111111
} );

//Geometry
let torusGeo = new THREE.TorusGeometry(10, 3, 16, 100);
let groundGeo = new THREE.BoxBufferGeometry( 20, 0.1, 20 );

//Shapes
let torus = new THREE.Mesh(torusGeo, lambertMaterial);
let ground = new THREE.Mesh(groundGeo, groundMaterial);
let underGround = new THREE.Mesh(groundGeo, groundMaterial);


//Mic stuff
let rmslow = 10;
let rmshigh = 80;
let rms,
    peak,
    highAvFreq,
    lowAvFreq,
    avFreq;

let colourKey = 9;
let layerKey = 5;

//Setup
sceneSetup();

/** Variable width/height canvas Listener function */
window.addEventListener('resize', re => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

/* Experiment 3 Code */
let prevThetaS = 0;
let prevThetaL = Math.PI/4;
let sphereGeo = new THREE.SphereBufferGeometry(1000, 3, 32, 0, Math.PI*2, prevThetaS, prevThetaL);
let sphereMaterial = new THREE.MeshPhongMaterial({color: 0xffff00, side: THREE.DoubleSide});
let sphere = new THREE.Mesh(sphereGeo, sphereMaterial);

sphere.position.set(0, 0, -window.innerHeight/3);
sphere.rotation.set(Math.PI/6, 0, 0);

light_1.target = sphere;
light_1.position.set(0, window.innerHeight/4, 0);
camera.position.set(0, window.innerWidth*2.1, 0);

scene.add(sphere);
scene.add(light_2);

function experiment3Loop() {

    changeColour(sphere, colour);
    let currRotation = sphere.rotation.y%Math.PI;

    switch (layerKey) {
        /*case 0:
            for(let i = 0; i < bufferLength; i++) {
                sphereGeo.vertices[(i)%sphereGeo.vertices.length].z = frequencyData[i];
            }
            break;
        case 1:
            scene.remove(sphere);
            prevThetaS = Math.sin(highAvFreq);
            sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, Math.sqrt(fftSize), Math.sqrt(fftSize), 0, Math.PI*2, prevThetaS, prevThetaL), sphereMaterial);
            scene.add(sphere);
            break;
        case 2:
            scene.remove(sphere);
            prevThetaL = rms % Math.PI;
            sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, Math.sqrt(fftSize), Math.sqrt(fftSize), 0, Math.PI*2, prevThetaS, prevThetaL), sphereMaterial);
            scene.add(sphere);
            break;
        case 3:
            if(kickAv-(kickDeviation*kickFactor*1.5) > kickArr[kickArrCounter] || kickArr[kickArrCounter] > kickAv+(kickDeviation*kickFactor)) {
                prevThetaS += 0.05;
                let widthSeg = sphere.geometry.parameters.widthSegments;
                let heightSeg = sphere.geometry.parameters.heightSegments;
                scene.remove(sphere);
                sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, widthSeg, heightSeg, 0, Math.PI*2, prevThetaS%(Math.PI/4), prevThetaL), sphereMaterial);
                scene.add(sphere);
                console.log("===kick===");
            }
            break;
        case 4:
            if(bassAv-(bassDeviation*bassFactor*1.5) > bassArr[bassArrCounter]  || bassArr[bassArrCounter] > bassAv+(bassDeviation*bassFactor)) {
                if (bassArr[bassArrCounter] > bassAv + (bassDeviation * (bassFactor + .5))) {
                    colourKey = Math.floor(Math.random() * 9);
                    //console.log("colourKey: " + colourKey);
                    console.log("!! colour change !!");
                }
                prevThetaS = 2*Math.PI*Math.sin(bassAv);
                //console.log(prevThetaS);
                prevThetaL =  kickEnergy % Math.PI/2;
                console.log("MORPH");
                scene.remove(sphere);
                sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, Math.floor(bassEnergy)%32, Math.floor(kickEnergy)%32, 0, Math.PI*2, prevThetaS, prevThetaL), sphereMaterial);
                scene.add(sphere);
            }
            break;
        case 5:
             if(kickAv-(kickDeviation*kickFactor*1.5) > kickArr[kickArrCounter] || kickArr[kickArrCounter] > kickAv+(kickDeviation*kickFactor)) {
                if (bassArr[bassArrCounter] > bassAv + (bassDeviation * (bassFactor + .5))) {
                    colourKey = Math.floor(Math.random() * 12);
                    console.log("colourKey: " + colourKey);
                }
                prevThetaS = Math.PI*Math.sin(bassAv);
                prevThetaL =  kickEnergy % Math.PI;
                scene.remove(sphere);
                sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, Math.floor(bassEnergy)%32, Math.floor(kickEnergy)%32, 0, Math.PI*2, prevThetaS%(Math.PI/4), prevThetaL), sphereMaterial);
                /!*sphere.position.set(0, 0, -window.innerHeight/3);
                sphere.rotation.set(Math.PI/6, 0, 0);*!/
                scene.add(sphere);
                sphereMaterial.wireframe = !sphereMaterial.wireframe;
                boxMaterial.wireframe = !boxMaterial.wireframe;
                boxRoofMaterial.wireframe = !boxRoofMaterial.wireframe;
                console.log("===kick===");
            } else if(snareAv-(snareDeviation*snareFactor*1.5) > snareArr[snareArrCounter] || snareArr[snareArrCounter] > snareAv+(snareDeviation*snareFactor)) {
                if (bassArr[bassArrCounter] > bassAv + (bassDeviation * (bassFactor + .5))) {
                    colourKey = Math.floor(Math.random() * 12);
                    console.log("colourKey: " + colourKey);
                }
                prevThetaS = Math.PI*Math.sin(bassAv);
                prevThetaL =  snareEnergy % Math.PI;
                scene.remove(sphere);
                sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, Math.floor(bassEnergy)%32, Math.floor(kickEnergy)%32, 0, Math.PI*2, prevThetaS%(Math.PI/4), prevThetaL), sphereMaterial);
                /!*sphere.position.set(0, 0, -window.innerHeight/3);
                sphere.rotation.set(Math.PI/6, 0, 0);*!/
                scene.add(sphere);
                console.log("---snare---");
            } else if(midsAv-(midsDeviation*midsFactor*1.5) > kickArr[kickArrCounter] || midsArr[midsArrCounter] > midsAv+(midsDeviation*midsFactor)) {
                 prevThetaS += Math.asin(midsAv/500)/10;
                 let widthSeg = sphere.geometry.parameters.widthSegments;
                 let heightSeg = sphere.geometry.parameters.heightSegments;
                 scene.remove(sphere);
                 sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, widthSeg, heightSeg, 0, Math.PI*2, prevThetaS%(Math.PI/4), prevThetaL), sphereMaterial);
                 /!*sphere.position.set(0, 0, -window.innerHeight/3);
                 sphere.rotation.set(Math.PI/6, 0, 0);*!/
                 scene.add(sphere);
                 console.log("!!!mids!!!");
             }
            break;
        case 6:
            if(kickAv-(kickDeviation*kickFactor*1.5) > kickArr[kickArrCounter] || kickArr[kickArrCounter] > kickAv+(kickDeviation*kickFactor)) {
                if (bassArr[bassArrCounter] > bassAv + (bassDeviation * (bassFactor + .5))) {
                    colourKey = Math.floor(Math.random() * 12);
                    console.log("colourKey: " + colourKey);
                }
                prevThetaS = Math.PI*Math.sin(bassAv);
                prevThetaL =  kickEnergy % Math.PI;
                scene.remove(sphere);
                sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, Math.floor(bassEnergy)%32, Math.floor(kickEnergy)%32, 0, Math.PI*2, prevThetaS%(Math.PI/4), prevThetaL), sphereMaterial);
                /!*sphere.position.set(0, 0, -window.innerHeight/3);
                sphere.rotation.set(Math.PI/6, 0, 0);*!/
                scene.add(sphere);
                sphereMaterial.wireframe = !sphereMaterial.wireframe;
                boxMaterial.wireframe = !boxMaterial.wireframe;
                boxRoofMaterial.wireframe = !boxRoofMaterial.wireframe;
                console.log("===kick===");
            } else if(snareAv-(snareDeviation*snareFactor*1.5) > snareArr[snareArrCounter] || snareArr[snareArrCounter] > snareAv+(snareDeviation*snareFactor)) {
                if (bassArr[bassArrCounter] > bassAv + (bassDeviation * (bassFactor + .5))) {
                    colourKey = Math.floor(Math.random() * 12);
                    console.log("colourKey: " + colourKey);
                }
                prevThetaS = Math.PI*Math.sin(bassAv);
                prevThetaL =  snareEnergy % Math.PI;
                scene.remove(sphere);
                sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, Math.floor(bassEnergy)%32, Math.floor(kickEnergy)%32, 0, Math.PI*2, prevThetaS%(Math.PI/4), prevThetaL), sphereMaterial);
               /!* sphere.position.set(0, 0, -window.innerHeight/3);
                sphere.rotation.set(Math.PI/6, 0, 0);*!/
                scene.add(sphere);
                console.log("---snare---");
            } else {
                prevThetaS += Math.sin(midsAv/2500)/8;
                let widthSeg = sphere.geometry.parameters.widthSegments;
                let heightSeg = sphere.geometry.parameters.heightSegments;
                scene.remove(sphere);
                sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, widthSeg, heightSeg, 0, Math.PI*2, prevThetaS%(Math.PI/4), prevThetaL), sphereMaterial);
                /!*sphere.position.set(0, 0, -window.innerHeight/3);
                sphere.rotation.set(Math.PI/6, 0, 0);*!/
                scene.add(sphere);
            }
            break;
        case 7:*/
        case 1:
            if(bassAv-(bassDeviation*bassFactor*1.5) > bassArr[bassArrCounter] || bassArr[bassArrCounter] > bassAv+(bassDeviation*bassFactor)) {
                if (kickArr[kickArrCounter] > kickAv + (kickDeviation * (kickFactor + .5))) {
                    colourKey = Math.floor(Math.random() * 12);
                    console.log("colourKey: " + colourKey);
                }
                prevThetaS = Math.PI*Math.sin(bassAv);
                prevThetaL =  kickEnergy % Math.PI;
                scene.remove(sphere);
                sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, Math.floor(bassEnergy)%32, Math.floor(kickEnergy)%32, 0, Math.PI*2, prevThetaS%(Math.PI/4), prevThetaL), sphereMaterial);
                scene.add(sphere);
                sphereMaterial.wireframe = !sphereMaterial.wireframe;
                boxMaterial.wireframe = !boxMaterial.wireframe;
                boxRoofMaterial.wireframe = !boxRoofMaterial.wireframe;
                console.log("===bass===");
            } else if(midsAv-(midsDeviation*midsFactor*1.5) > kickArr[kickArrCounter] || midsArr[midsArrCounter] > midsAv+(midsDeviation*midsFactor)) {
                prevThetaS += Math.asin(midsAv/500)/10;
                let widthSeg = sphere.geometry.parameters.widthSegments;
                let heightSeg = sphere.geometry.parameters.heightSegments;
                scene.remove(sphere);
                sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, widthSeg, heightSeg, 0, Math.PI*2, prevThetaS%(Math.PI/4), prevThetaL), sphereMaterial);
                scene.add(sphere);
                console.log("!!!mids!!!");
            }
            break;

        default:
            if(kickAv-(kickDeviation*kickFactor*1.5) > kickArr[kickArrCounter] || kickArr[kickArrCounter] > kickAv+(kickDeviation*kickFactor)) {
                if (bassArr[bassArrCounter] > bassAv + (bassDeviation * (bassFactor + .5))) {
                    colourKey = Math.floor(Math.random() * 12);
                    console.log("colourKey: " + colourKey);
                }
                prevThetaS = Math.PI*Math.sin(bassAv);
                prevThetaL =  kickEnergy % Math.PI;
                scene.remove(sphere);
                sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, Math.floor(bassEnergy)%32, Math.floor(kickEnergy)%32, 0, Math.PI*2, prevThetaS%(Math.PI/4), prevThetaL), sphereMaterial);
                /*sphere.position.set(0, 0, -window.innerHeight/3);
                sphere.rotation.set(Math.PI/6, 0, 0);*/
                scene.add(sphere);
                sphereMaterial.wireframe = !sphereMaterial.wireframe;
                boxMaterial.wireframe = !boxMaterial.wireframe;
                boxRoofMaterial.wireframe = !boxRoofMaterial.wireframe;
                console.log("===kick===");
            } else if(snareAv-(snareDeviation*snareFactor*1.5) > snareArr[snareArrCounter] || snareArr[snareArrCounter] > snareAv+(snareDeviation*snareFactor)) {
                if (bassArr[bassArrCounter] > bassAv + (bassDeviation * (bassFactor + .5))) {
                    colourKey = Math.floor(Math.random() * 12);
                    console.log("colourKey: " + colourKey);
                }
                prevThetaS = Math.PI*Math.sin(bassAv);
                prevThetaL =  snareEnergy % Math.PI;
                scene.remove(sphere);
                sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, Math.floor(bassEnergy)%32, Math.floor(kickEnergy)%32, 0, Math.PI*2, prevThetaS%(Math.PI/4), prevThetaL), sphereMaterial);
                /*sphere.position.set(0, 0, -window.innerHeight/3);
                sphere.rotation.set(Math.PI/6, 0, 0);*/
                scene.add(sphere);
                console.log("---snare---");
            } else {
                prevThetaS += Math.sin(midsAv/8)/100;
                let widthSeg = sphere.geometry.parameters.widthSegments;
                let heightSeg = sphere.geometry.parameters.heightSegments;
                scene.remove(sphere);
                sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, widthSeg, heightSeg, 0, Math.PI*2, prevThetaS%(Math.PI/4), prevThetaL), sphereMaterial);
                /*sphere.position.set(0, 0, -window.innerHeight/3);
                sphere.rotation.set(Math.PI/6, 0, 0);*/
                scene.add(sphere);
            }
    }

    if(snareAv-(snareDeviation*snareFactor) > snareArr[snareArrCounter] || snareArr[snareArrCounter] > snareAv+(snareDeviation*snareFactor)) {
        sphere.rotation.set(0, currRotation + Math.pow(Math.E, bassAv/100)/100, 0);
    } else {
        sphere.rotation.set(0, currRotation - Math.pow(Math.E, bassAv/100)/100, 0);
    }
    //console.log(sphere.rotation.y);
    //clearInterval(interval);

}

/* Experiment 2 Code */
scene.add(boxPlane);
light_1.target = boxPlane;
scene.add(boxPlaneRoof);
var aa = 0;

let switchPlane = false;
let switchRotation = true;

function experiment2Loop() {

    for(let i = 0; i < boxGeo.vertices.length; i++) {
        boxGeo.vertices[i].z = 0;
        boxRoofGeo.vertices[i].z = 0;
    }
    switch (layerKey) {
        case 1:
            if (bassArr[bassArrCounter] > bassAv + (bassDeviation * (bassFactor+.75))) {
                aa += .5;
                console.log(aa);
            } else if(midsAv-(midsDeviation*midsFactor*1.5) > kickArr[kickArrCounter] || midsArr[midsArrCounter] > midsAv+(midsDeviation*midsFactor)) {
                if (switchPlane) {
                    changeColour(boxPlane, 0x000000);
                    changeColour(boxPlaneRoof, colour);

                    for (let i = 0; i < bufferLength; i++) {
                        boxRoofGeo.vertices[(i*Math.floor(aa))%boxGeo.vertices.length].z = frequencyData[i]*2.5;
                    }
                } else {
                    changeColour(boxPlaneRoof, 0x000000);
                    changeColour(boxPlane, colour);

                    for (let i = 0; i < bufferLength; i++) {
                        boxGeo.vertices[(i*Math.floor(aa))%boxGeo.vertices.length].z = frequencyData[i]*2.5;
                    }
                }
                console.log("!!!mids!!!");
            } else if(snareAv-(snareDeviation*snareFactor*1.5) > snareArr[snareArrCounter] || snareArr[snareArrCounter] > snareAv+(snareDeviation*snareFactor)) {
                switchPlane = !switchPlane;
                switchRotation = !switchRotation;
            }
            break;
        default:
            if (bassArr[bassArrCounter] > bassAv + (bassDeviation * (bassFactor+.75))) {
                aa += .5;
                console.log(aa);
            }
            if(snareAv-(snareDeviation*snareFactor*1.5) > snareArr[snareArrCounter] || snareArr[snareArrCounter] > snareAv+(snareDeviation*snareFactor)) {
                switchPlane = !switchPlane;
                switchRotation = !switchRotation;
            }

            if (switchPlane) {
                changeColour(boxPlane, 0x000000);
                changeColour(boxPlaneRoof, colour);

                for (let i = 0; i < bufferLength; i++) {
                    boxRoofGeo.vertices[(i*Math.floor(aa))%boxGeo.vertices.length].z = frequencyData[i]*2.5;
                }
            } else {
                changeColour(boxPlaneRoof, 0x000000);

                for (let i = 0; i < bufferLength; i++) {
                    boxGeo.vertices[(i*Math.floor(aa))%boxGeo.vertices.length].z = frequencyData[i]*2.5;
                }
            }
    }
    boxGeo.verticesNeedUpdate = true;
    boxRoofGeo.verticesNeedUpdate = true;
}

/* Experiment 1 Code */
/*scene.add(plane);
light_1.target = plane;

function experiment1Loop() {
    switch (layerKey) {
        case 1:
            for(let i = Math.floor(fftSize*8.5/10); i < bufferLength+Math.floor(fftSize*8.5/10); i++) {
                planeGeo.vertices[(i)%planeGeo.vertices.length].z = frequencyData[i-Math.floor(fftSize*8.5/10)];
            }
            break;
        case 2:
            for(let i = Math.floor(fftSize/4); i < bufferLength+Math.floor(fftSize/4); i++) {
                planeGeo.vertices[(i)%planeGeo.vertices.length].z = frequencyData[i-Math.floor(fftSize/4)];
            }
            break;
        case 3:
            for (let i = 0; i < bufferLength; i++) {
                planeGeo.vertices[(i*3)%planeGeo.vertices.length].z = frequencyData[i];
            }
            break;
        case 4:
            start += Math.sqrt(fftSize-10)/10;
            for (let i = Math.floor(start); i < bufferLength+Math.floor(start); i++) {
                planeGeo.vertices[i%planeGeo.vertices.length].z = frequencyData[i-Math.floor(start)];
            }
            break;
        case 5:
            start += 0.1;
            for (let i = Math.floor(start); i < bufferLength+Math.floor(start); i++) {
                planeGeo.vertices[i%planeGeo.vertices.length].z = frequencyData[i-Math.floor(start)];
            }
            break;
        case 6:
            start += Math.sqrt(fftSize-10)/10;
            for (let i = Math.floor(start); i < Math.floor(start+start); i++) {
                planeGeo.vertices[i%planeGeo.vertices.length].z = frequencyData[i-Math.floor(start)];
            }
            for (let i = Math.floor(start+start); i < bufferLength+Math.floor(start); i++) {
                planeGeo.vertices[i%planeGeo.vertices.length].z = frequencyData[i-Math.floor(start)];
            }
            break;
        default:
            for(let i = Math.floor(fftSize*8.5/10); i < bufferLength+Math.floor(fftSize*8.5/10); i++) {
                planeGeo.vertices[(i)%planeGeo.vertices.length].z = frequencyData[i-Math.floor(fftSize*8.5/10)];
            }
    }
    planeGeo.verticesNeedUpdate = true;
}*/


//Helper functions

function changeCameraRotation() {
    if(!switchRotation) {
        controls.autoRotateSpeed = Math.sqrt( kickEnergy*Math.atan(rms));
    } else {
        controls.autoRotateSpeed = -Math.sqrt( kickEnergy*Math.atan(rms));
    }

}

function changeCameraZoom() {

    camera.zoom = Math.pow(2*Math.asinh((rms + bassEnergy)/300), 1.12);

    //camera.zoom = Math.sin(highAvFreq/100) * Math.sin(lowAvFreq / 50); //good

    if(camera.zoom > 2.5) {
        camera.zoom = 2.5 ;
    } else if(camera.zoom < .75) {
        camera.zoom = .75;
    }
}

let lowerBass = 0;
let upperBass = 4;
let lowerKick = 1;
let upperKick = 3;
let lowerSnare = 2;
let upperSnare = 4;
let lowerMids = 4;
let upperMids = 18;
let lowerHighs = 32;
let upperHighs = 200;

let bassEnergy = 0;
let kickEnergy = 0;
let snareEnergy = 0;
let midsEnergy = 0;
let highsEnergy = 0;

let bassArrCounter = 0;
let arrLimit = 20;
let bassArr = [];
let bassAv = 0;
let bassDeviation = 0;
let bassFactor = 2.1;

let kickArrCounter = 0;
let kickArr = [];
let kickAv = 0;
let kickDeviation = 0;
let kickFactor = 2.1;

let snareArrCounter = 0;
let snareArr = [];
let snareAv = 0;
let snareDeviation = 0;
let snareFactor = 2;

let midsArrCounter = 0;
let midsArr = [];
let midsArrLimit = 60;
let midsAv = 0;
let midsDeviation = 0;
let midsFactor = 1.15;


function getDataNew() {
    bassEnergy = 0;
    kickEnergy = 0;
    snareEnergy = 0;
    midsEnergy = 0;
    highsEnergy = 0;
    avFreq = 0;
    rms = 0;
    bassAv = 0;
    bassDeviation = 0;
    kickAv = 0;
    kickDeviation = 0;
    snareAv = 0;
    snareDeviation = 0;
    midsAv = 0;
    midsDeviation = 0;

    analyser.getByteFrequencyData(frequencyData);

    /*console.log(frequencyData);*/

    for (let i = 0; i < bufferLength; i++) {
        avFreq += frequencyData[i];
        rms += frequencyData[i]*frequencyData[i];
    }
    avFreq = avFreq/bufferLength;
    rms = Math.sqrt(rms/bufferLength);

    for (let i = lowerBass; i < upperBass; i++) {
        bassEnergy += frequencyData[i];
    }
    bassEnergy = bassEnergy/(upperBass-lowerBass);

    for (let i = lowerKick; i < upperKick; i++) {
        kickEnergy += frequencyData[i];
    }
    kickEnergy = kickEnergy/(upperKick-lowerKick);

    for (let i = lowerSnare; i < upperSnare; i++) {
        snareEnergy += frequencyData[i];
    }
    snareEnergy = snareEnergy/(upperSnare-lowerSnare);

    for (let i = lowerMids; i < upperMids; i++) {
        midsEnergy += frequencyData[i];
    }

    midsEnergy = midsEnergy/(upperMids-lowerMids);

    if(bassArrCounter >= arrLimit) {
        bassArrCounter = 0;
        console.log("-- bar change --")
    }
    if(kickArrCounter >= arrLimit) {
        kickArrCounter = 0;
    }
    if(snareArrCounter >= arrLimit) {
        snareArrCounter = 0;
    }
    if(midsArrCounter >= midsArrLimit) {
        midsArrCounter = 0;
    }
    midsArr[midsArrCounter++] = midsEnergy;
    snareArr[snareArrCounter++] = snareEnergy;
    kickArr[kickArrCounter++] = kickEnergy;
    bassArr[bassArrCounter++] = bassEnergy;

    //console.log(bassArr);

    for(let i = 0; i < bassArr.length; i++) {
        bassAv += bassArr[i];
        bassDeviation += bassArr[i]*bassArr[i];
    }

    for(let i = 0; i < kickArr.length; i++) {
        kickAv += kickArr[i];
        kickDeviation += kickArr[i]*kickArr[i];
    }

    for(let i = 0; i < snareArr.length; i++) {
        snareAv += snareArr[i];
        snareDeviation += snareArr[i]*snareArr[i];
    }

    for(let i = 0; i < midsArr.length; i++) {
        midsAv += midsArr[i];
        midsDeviation += midsArr[i]*midsArr[i];
    }

    bassAv = bassAv/bassArr.length;
    bassDeviation = Math.sqrt(bassDeviation / bassArr.length - bassAv * bassAv);

    kickAv = kickAv/kickArr.length;
    kickDeviation = Math.sqrt(kickDeviation / kickArr.length - kickAv * kickAv);

    snareAv = snareAv/snareArr.length;
    snareDeviation = Math.sqrt( snareDeviation / snareArr.length - snareAv * snareAv);

    midsAv = midsAv/midsArr.length;
    midsDeviation = Math.sqrt( midsDeviation / midsArr.length - midsAv * midsAv);

    for (let i = lowerHighs; i < upperHighs; i++) {
        highsEnergy += frequencyData[i];
    }
    highsEnergy = highsEnergy/(upperHighs-lowerHighs);

    if(rms < rmslow) {
        //console.log(rms);
        analyser.minDecibels -= 1;
        rmslow--;
        rmshigh = 80;
        analyser.maxDecibels = -30;
        //decrease light
        if(light_1.intensity > 1) {
            light_1.intensity -= .05;
        }
    } else if(rms > rmshigh) {
        //console.log(rms);
        analyser.maxDecibels += 1;
        rmshigh++;
        rmslow = 10;
        analyser.minDecibels = -85;
        //increase light
        light_1.intensity += .05;
    }

    //console.log("highsEnergy: " + highsEnergy);

}


function addShape(shape_to_add) {
    scene.add(shape_to_add);
}

function sceneSetup() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('main-container').appendChild(renderer.domElement);

    scene.add(light_1);
    scene.add(camera);

    camera.far = 2500;
    camera.position.set(0,window.innerWidth,window.innerHeight/1.5);
    camera.rotation.set(-1.5, 0, 0);
    light_1.position.set(0,camera.position.y*3,camera.position.z*2);

    //controls.autoRotate = true;
}

function setColour() {
    rms = rms/1.5;
    switch (colourKey) {
        case 1:
            colour = rgbToHex(rms, rms, Math.pow(rms, 1.3));
            break;
        case 2:
            colour = rgbToHex(rms, Math.pow(rms, 1.3), rms);
            break;
        case 3:
            colour = rgbToHex(Math.pow(rms, 1.3), rms, rms);
            break;
        case 4:
            colour = rgbToHex(rms/10, Math.pow(rms, 1.5), rms*2);
            break;
        case 5:
            colour = rgbToHex(rms*3, rms/10, rms*2);
            break;
        case 6:
            colour = rgbToHex(Math.pow(rms, 1.5)*1.5, rms*2, rms/10);
            break;
        case 7:
            colour = rgbToHex(rms/10, rms*2, rms*3);
            break;
        case 8:
            colour = rgbToHex(rms*2, Math.pow(rms, 1.5)*1.5, rms/10);
            break;
        case 9:
            colour = rgbToHex(rms*2, rms/10, bassEnergy);
            break;
        case 10:
            colour = rgbToHex(midsAv, snareAv, bassAv);
            break;
        case 11:
            colour = rgbToHex(kickAv, midsAv, snareAv);
            break;
        case 12:
            colour = rgbToHex(snareAv, midsAv, kickAv);
            break;
        default:
            colour = rgbToHex(frequencyData[4], frequencyData[8], frequencyData[12]);
    }
    rms = rms*1.5;
}

function rgbToHexHelper(num){
    let hex = Math.ceil(num).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r,g,b) {
    return ("0x" + rgbToHexHelper(r) + rgbToHexHelper(g) + rgbToHexHelper(b));
}

function changeColour(currShape, currColour) {
    currShape.material.color.setHex(currColour);
}


let start = 0;
let wait = 0;
let interval;

let run = function () {
    wait = wait + 0.5;

    if(micLoaded && wait > 50) {
        getDataNew();

        setColour();

        /* Experiment Code */
        //experiment1Loop();
        experiment2Loop();
        experiment3Loop(); //maybe try set interval here

    } else {
        console.log("loading mic data")
    }

    changeCameraRotation();
    changeCameraZoom();

    camera.updateProjectionMatrix();
    controls.update();
    requestAnimationFrame( run );
    renderer.render( scene, camera );
};
run();