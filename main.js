import * as THREE from 'three';
import { showLoadingScreen, hideLoadingScreen } from './loading.js';
import { initScene } from './scene.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function createControlButtons() {
    const controls = [
        { id: "forward", text: "↑", style: "bottom: 130px; left: 22%; transform: translateX(-50%);" },
        { id: "backward", text: "↓", style: "bottom: 30px; left: 22%; transform: translateX(-50%);" },
        { id: "left", text: "←", style: "bottom: 80px; left: 16.75%; transform: translateX(-50%);" },
        { id: "right", text: "→", style: "bottom: 80px; left: 27%; transform: translateX(-50%);" },
        { id: "up", text: "Q", style: "bottom: 120px; right: 10%; transform: translateY(-50%);" },
        { id: "down", text: "E", style: "bottom: 40px; right: 10%; transform: translateY(-50%);" },
        { id: "turn-left", text: "←←", style: "top: 50%; left: 10%; transform: translateY(-50%);" },
        { id: "turn-right", text: "→→", style: "top: 50%; right: 10%; transform: translateY(-50%);" },
        { id: "reset", text: "R", style: "top: 8%; left: 10%; transform: translateY(-50%);" },
    ];

    controls.forEach(({ id, text, style }) => {
        const button = document.createElement("div");
        button.id = id;
        button.className = "control-button";
        button.textContent = text;
        button.style.cssText = style;

        document.body.appendChild(button);

        // Add touch event listeners
        button.addEventListener("touchstart", (e) => {
            e.preventDefault();
            triggerKey(id, "keydown");
        });

        button.addEventListener("touchend", (e) => {
            e.preventDefault();
            triggerKey(id, "keyup");
        });
    });
}

function triggerKey(controlId, eventType) {
    const keyMap = {
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

    const key = keyMap[controlId];
    if (key) {
        const event = new KeyboardEvent(eventType, { code: key });
        window.dispatchEvent(event);
    }
}

// Add controls only for mobile devices
if (isMobile()) {
    createControlButtons();
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