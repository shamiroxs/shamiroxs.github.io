import * as THREE from 'three';
import { showLoadingScreen, updateLoadingProgress, hideLoadingScreen } from './loading.js';
import { initScene } from './scene.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

async function loadAssets(assetPaths, type) {
    const loader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();

    let loadedCount = 0;
    const totalAssets = assetPaths.length;

    const promises = assetPaths.map((path) => {
        return new Promise((resolve, reject) => {
            const onLoad = (asset) => {
                loadedCount++;
                const progress = Math.round((loadedCount / totalAssets) * 100);
                updateLoadingProgress(progress); // Update UI
                resolve(asset);
            };

            if (path.endsWith('.glb')) {
                loader.load(path, onLoad, undefined, reject);
            } else if (path.endsWith('.jpg') || path.endsWith('.png')) {
                textureLoader.load(path, onLoad, undefined, reject);
            } else {
                reject(new Error(`Unsupported asset type: ${path}`));
            }
        });
    });

    return Promise.all(promises);
}

async function initializeApp() {
    console.log('Starting the application...');

    // Display the loading screen UI
    showLoadingScreen();

    // Load assets
    const assetPaths = ['./assets/character.glb', 
    './assets/sky.jpg', './assets/background.glb', 
    './assets/cars/car1.glb', './assets/cars/car2.glb', 
    './assets/cars/car3.glb', './assets/cars/car4.glb', 
    './assets/aircraft.glb', './assets/cars/car1.glb', 
    './assets/cars/car4.glb', './assets/tv.glb',
    './assets/night.jpg', './assets/pyramid.glb',
    './assets/portal.glb', './assets/electronic.glb',
    './assets/tailor.glb', './assets/skyLink.glb', //[0 - 16]
    './assets/github.glb', './assets/linkedin.glb', 
    './assets/whatsapp.glb','./assets/gmail.glb'];//[ 0 - 20]

    const charaPaths = ['./assets/character_skin/blue.glb', 
    './assets/character_skin/purple.glb', 
    './assets/character_skin/yellow.glb', 
    './assets/character_skin/org.glb', 
    './assets/character_skin/green.glb', 
    './assets/character_skin/grey.glb', 
    './assets/character_skin/dark_grey.glb']    
 

    const assets = await loadAssets(assetPaths, "Game Assets");
    console.log('Game assets loaded!');

    const chara = await loadAssets(charaPaths, "Character Skins");
    console.log('Character skins loaded!');

    // Initialize the scene with loaded assets
    initScene(assets, chara);
}

// Start the application
initializeApp();
