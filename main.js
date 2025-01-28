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
            button.addEventListener("touchstart", () => triggerKey(controls[control]));
        }
    });

    // Gesture listeners for swipe and zoom
    let startX = 0, startY = 0;

    window.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }
    });

    window.addEventListener("touchmove", (e) => {
        if (e.touches.length === 1) {
            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 50) triggerKey("ArrowRight"); // Swipe right for turn right
                else if (deltaX < -50) triggerKey("ArrowLeft"); // Swipe left for turn left
            } else {
                if (deltaY > 50) triggerKey("KeyS"); // Swipe down for backward
                else if (deltaY < -50) triggerKey("KeyW"); // Swipe up for forward
            }

            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }
    });

    window.addEventListener("touchend", (e) => {
        if (e.touches.length === 0) {
            startX = 0;
            startY = 0;
        }
    });

    window.addEventListener("gesturestart", (e) => {
        if (e.scale > 1) triggerKey("ZoomIn"); // Pinch out to zoom in
        if (e.scale < 1) triggerKey("ZoomOut"); // Pinch in to zoom out
    });
}

// Simulate keypress event for the game
function triggerKey(key) {
    const event = new KeyboardEvent("keydown", { code: key });
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