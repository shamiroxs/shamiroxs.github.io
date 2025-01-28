import * as THREE from 'three';
import { showLoadingScreen, hideLoadingScreen } from './loading.js';
import { initScene } from './scene.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

window.onload = function() {
    if (isMobile()) {
        document.getElementById('mobile-controls').style.display = 'block';

        // Add event listeners for mobile controls
        document.getElementById('forward').addEventListener('click', () => { /* forward action */ });
        document.getElementById('backward').addEventListener('click', () => { /* backward action */ });
        document.getElementById('left').addEventListener('click', () => { /* left action */ });
        document.getElementById('right').addEventListener('click', () => { /* right action */ });
        document.getElementById('up').addEventListener('click', () => { /* up action */ });
        document.getElementById('down').addEventListener('click', () => { /* down action */ });
        document.getElementById('turn-left').addEventListener('click', () => { /* turn left action */ });
        document.getElementById('turn-right').addEventListener('click', () => { /* turn right action */ });
        document.getElementById('reset').addEventListener('click', () => { /* reset action */ });

        // Add touch event listeners for swipe and zoom
        document.addEventListener('touchstart', handleTouchStart, false);
        document.addEventListener('touchmove', handleTouchMove, false);
        document.addEventListener('touchend', handleTouchEnd, false);
        document.addEventListener('gesturechange', handleGestureChange, false);
    }
};

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    xDown = null;
    yDown = null;
}

async function loadAssets(assetPaths) {
    const loader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();

    const promises = assetPaths.map((path) => {
        return new Promise((resolve, reject) => {
            if (path.endsWith('.glb')) {
                loader.load(path, resolve, undefined, reject);
            } else if (path.endsWith('.jpg') || path.endsWith('.png')) {
                textureLoader.load(path, resolve, undefined, reject);
            } else {
                reject(new Error(`Unsupported asset type: ${path}`));
            }
        });
    });

    return Promise.all(promises);
}

async function initializeApp() {
    console.log('Starting the application...');

    // Display the loading screen
    showLoadingScreen();

    // Load assets
    const assetPaths = ['./assets/character.glb', './assets/sky.jpg', './assets/background.glb', './assets/cars/car1.glb', './assets/cars/car2.glb', './assets/cars/car3.glb', './assets/cars/car4.glb', './assets/aircraft.glb', './assets/cars/car1.glb', './assets/cars/car4.glb', './assets/tv.glb'];//[10]
    const assets = await loadAssets(assetPaths);
    console.log('Assets loaded and loading screen completed!');

    // Hide the loading screen
     // Clear the DOM content

    // Initialize the main scene with the loaded assets
    initScene(assets);    
}

// Start the application
initializeApp();