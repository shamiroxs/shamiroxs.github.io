import * as THREE from 'three';
import { showLoadingScreen, hideLoadingScreen } from './loading.js';
import { initScene } from './scene.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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

    document.addEventListener('DOMContentLoaded', () => {
        const keyboardButton = document.getElementById('show-keyboard-button');
        const hiddenInput = document.getElementById('hidden-input');
    
        keyboardButton.addEventListener('click', () => {
            // Focus the hidden input to trigger the keyboard
            hiddenInput.focus();
        });
    
        // Optional: Blur the input when user presses Enter or Escape
        hiddenInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === 'Escape') {
                hiddenInput.blur(); // Dismiss the keyboard
            }
        });
    });
    
}

// Start the application
initializeApp();