"use strict"

//sets up the background image processes
let scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); //black

let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 10;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//sets up the shapes used
let geometry1 = new THREE.TorusGeometry(1.7, 0.5, 16, 100);
let geometry2 = new THREE.TorusGeometry(2.6, 0.5, 16, 100);
let geometry3 = new THREE.TorusGeometry(3.5, 0.5, 16, 100);
let material = new THREE.MeshPhongMaterial();

let torus1 = new THREE.Mesh(geometry1, material);
scene.add(torus1);

let torus2 = new THREE.Mesh(geometry2, material);
scene.add(torus2);

let torus3 = new THREE.Mesh(geometry3, material);
scene.add(torus3);

//sets up the colored lights
let light1 = new THREE.PointLight(0xff0000); //red
light1.intensity = 0;
light1.position.set(3, 3, 5);
light1.castShadow = true;
light1.increment = 0.001;
scene.add(light1);

let light2 = new THREE.PointLight(0x0000ff); //blue
light2.intensity = 0;
light2.position.set(-3, 3, 5);
light2.castShadow = true;
light2.increment = 0.001;
scene.add(light2);

let light3 = new THREE.PointLight(0xffa3ff); //light purple
light3.intensity = 0;
light3.position.set(0, -3, 5);
light3.castShadow = true;
light3.increment = 0.001;
scene.add(light3);

let coloredLights = [light1, light2, light3];

//sets up the white lights
let light4 = new THREE.PointLight(0xffffff); //white
light4.intensity = 0;
light4.position.set(0, 10, 2);
light4.castShadow = true;
light4.increment = -0.05;
scene.add(light4);
let fourIsOn = true;

let light5 = new THREE.PointLight(0xffffff);
light5.intensity = 0;
light5.position.set(10, -10, 2);
light5.castShadow = true;
light5.increment = -0.05;
scene.add(light5);
let fiveIsOn = false;

let light6 = new THREE.PointLight(0xffffff);
light6.intensity = 0;
light6.position.set(-10, -10, 2);
light6.castShadow = true;
light6.increment = -0.05;
scene.add(light6);
let sixIsOn = false;

let whiteLights = [light4, light5, light6];

///////////////

//moves the object and changes the lighting on each tick
let animate = function() {

    requestAnimationFrame(animate);
    torus1.rotation.x += 0.005;
    torus1.rotation.y += 0.005;
    torus1.rotation.z += 0.005;
    torus2.rotation.y += 0.007;
    torus2.rotation.z += 0.007;
    torus2.rotation.x += 0.007;
    torus3.rotation.z += 0.013;
    torus3.rotation.x += 0.013;
    torus3.rotation.y += 0.013;

    for (let l of coloredLights) {
        l.intensity += l.increment;
        if (l.intensity >= 0.35) {
            l.intensity = 0.33;
            l.increment = - l.increment;
        }
        if (l.intensity <= 0) {
            l.intensity = 0.02;
            l.increment = -l.increment;
        }
    }

    for (let l of whiteLights) {
        if (l.intensity > 0) {
            l.intensity += l.increment;
        }
    }

    renderer.render( scene, camera );
};

///////////////

//sets up the audio analyzer
let initAnalyser = function() {
    let file = document.getElementById("fileLabel");
    let audio = document.getElementById("audio");
    let fileLabel = document.querySelector("label.file");

    file.onchange = function () {
        fileLabel.classList.add("normal");
        audio.classList.add("active");
        let files = this.files;

        audio.src = URL.createObjectURL(files[0]);
        audio.load();

        let AudioContext = window.AudioContext || window.webkitAudioContext;
        let context = new AudioContext();
        let src = context.createMediaElementSource(audio);
        let analyser = context.createAnalyser()
        src.connect(analyser);
        analyser.connect(context.destination);
        analyser.fftSize = 32;
        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        setInterval(() => {
            analyser.getByteTimeDomainData(dataArray);
            if (Math.max.apply(null, dataArray) > 240) { //arbitrary value of 240, seems to work well
                flash();
            }}, 20); //occurs every 20ms
    }
}

///////////////

//turns a light on in rotating order
let flash = function() {
    if (fourIsOn) {
        light4.intensity = 1;
        fourIsOn = false;
        fiveIsOn = true;
    }
    else if (fiveIsOn) {
        light5.intensity = 1;
        fiveIsOn = false;
        sixIsOn = true;
    }
    else { //sixIsOn
        light6.intensity = 1;
        sixIsOn = false;
        fourIsOn = true;
    }
}

///////////////

//makes the file selector hidden for better viewing
let hide = function() {
    document.getElementById("fileLabel").hidden = true;
}

///////////////

//function calls
animate();
window.onload = initAnalyser();