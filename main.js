import * as THREE from 'three';
import { showLoadingScreen, hideLoadingScreen } from './loading.js';
import { initScene } from './scene.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Detect if the user is on mobile
function isMobile() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}
// Map button presses to game actions
function bindMobileControls() {
    const controls = {
        forward: "KeyW",
        backward: "KeyS",
        left: "KeyA",
        right: "KeyD",
        up: "KeyQ",
        down: "KeyE",
        "turn-left": "ArrowLeft",
        "turn-right": "ArrowRight",
        reset: "KeyR",
    };

    Object.keys(controls).forEach((control) => {
        const button = document.getElementById(control);

        if (button) {
            // Handle touchstart to trigger keydown
            button.addEventListener("touchstart", (e) => {
                e.preventDefault(); // Prevent scrolling or accidental behavior
                triggerKey(controls[control], "keydown");
            });

            // Handle touchend to trigger keyup
            button.addEventListener("touchend", (e) => {
                e.preventDefault(); // Prevent scrolling or accidental behavior
                triggerKey(controls[control], "keyup");
            });
        }
    });

    // Gesture listeners for zoom in and zoom out
    window.addEventListener("gesturestart", (e) => {
        if (e.scale > 1) triggerKey("ZoomIn", "keydown"); // Pinch out to zoom in
        if (e.scale < 1) triggerKey("ZoomOut", "keydown"); // Pinch in to zoom out
    });

    window.addEventListener("gestureend", (e) => {
        triggerKey("ZoomIn", "keyup");
        triggerKey("ZoomOut", "keyup");
    });
}

// Simulate keypress events for the game
function triggerKey(key, eventType) {
    const event = new KeyboardEvent(eventType, { code: key });
    window.dispatchEvent(event);
}

// Show controls if on mobile
if (isMobile()) {
    document.getElementById("mobile-controls").style.display = "block";
    bindMobileControls();
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