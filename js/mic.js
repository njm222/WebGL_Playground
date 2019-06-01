let micLoaded = false;
let fftSize = 512;

let context,
    analyser,
    frequencyData,
    bufferLength,
    source;     // the audio source

if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {

        // First get ahold of the legacy getUserMedia, if present
        let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
    }
}

if (navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');
    navigator.mediaDevices.enumerateDevices().then((devices) => {
        console.log(devices);
        /*devices = devices.filter((d) => d.kind === 'audiooutput');*/
        let constraints = {video: true, audio: {deviceId: 'default'}};
        navigator.mediaDevices.getUserMedia (constraints)
            .then(
                function(stream) { console.log(stream);
                    //Video setup start
                    let videoSettings = stream.getVideoTracks()[0].getSettings();
                    let video = document.createElement("video");
                    Object.assign(video, {
                        srcObject: stream,
                        height: videoSettings.height,
                        width: videoSettings.width,
                        autoplay: true
                    });
                    let videoTexture = new THREE.VideoTexture( video );
                    videoTexture.minFilter = THREE.LinearFilter;
                    videoTexture.magFilter = THREE.LinearFilter;
                    videoTexture.format = THREE.RGBFormat;
                    let movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, side: THREE.DoubleSide } );
                    // the geometry on which the movie will be displayed;
                    // movie image will be scaled to fit these dimensions.
                    let videoGeometry = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight, 4, 4 );
                    let videoScreen = new THREE.Mesh( videoGeometry, movieMaterial );
                    videoScreen.rotation.set(Math.PI/4*6, 0, 0);
                    scene.add(videoScreen);
                    //Video setup end

                    //Creates the context
                    if(typeof AudioContext !== "undefined"){
                        context = new AudioContext();
                    }
                    else if (typeof webkitAudioContext !== "undefined"){
                        context = new webkitAudioContext();
                    }
                    else {
                        console.log('AudioContext is not supported! Please view this with Chrome')
                    }
                    //create analyser
                    analyser = context.createAnalyser();
                    analyser.fftSize = fftSize*2;
                    /*analyser.maxDecibels = 0;
                    analyser.maxDecibels = 0;*/
                    analyser.smoothingTimeConstant = .75;
                    frequencyData = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(frequencyData);
                    bufferLength = analyser.frequencyBinCount/2;
                    analyser.minDecibels = -90;
                    analyser.maxDecibels = -25;
                    //attach source to the mic
                    source = context.createMediaStreamSource(stream);
                    //connect source to the analyser
                    source.connect(analyser);
                    console.log(micLoaded);
                    micLoaded = true;
                    console.log(micLoaded);
                }).catch( function(err) { console.log('The following gUM error occured: ' + err);})
    }).catch( function(err) { console.log('The following error occured: ' + err);})
} else {
    console.log('getUserMedia not supported on your browser!');
}
