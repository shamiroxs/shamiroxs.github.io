import * as THREE from 'three';
import { showLoadingScreen, updateLoadingProgress, hideLoadingScreen } from './loading.js';
import { initScene } from './scene.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'; 

let progress;

async function loadAssets(assetPaths, type) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/'); 

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader); 
    const textureLoader = new THREE.TextureLoader();

    let loadedCount = 0;
    const totalAssets = assetPaths.length;

    const promises = assetPaths.map((path) => {
        return new Promise((resolve, reject) => {
            const onLoad = (asset) => {
                loadedCount++;
                if (totalAssets < 8) {
                    progress = 100;
                } else {
                    progress = Math.round((loadedCount / totalAssets) * 100) - 1;
                }
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
