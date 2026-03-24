import * as THREE from 'three';
import { playAirBalloonSound } from './sound';
import { isMobile } from './phone';

// Shared variables for the scene, camera, renderer, and objects
let scene, camera, renderer, sphere, circle, raycaster, mouse;
let animationFrameId; // To store the animation frame ID for cleanup

// Carousel and Tips data
const bgImages = ['/image/imge1.jpg', '/image/imge2.jpg', '/image/imge4.jpg'];
let currentImgIndex = 0;
let bgInterval;

const getGameTips = () => [
    isMobile() ? "Tip: Use the on-screen controls and swipe to navigate." : "Tip: Use W, A, S, D to move and Mouse to look around.",
    "Navigation: Head left from the spawn to explore showcased projects.",
    "Navigation: Go straight ahead to find contact details.",
    "Customization: Turn right to change your character's skin.",
    "Secret: Touch the shiny pyramid on the right to start a mini-game!",
    "Lore: Beating the mini-game unlocks the power to teleport instantly.",
];

export function showLoadingScreen() {
    return new Promise((resolve) => {
        // Create loading screen elements

        // 1. Background Image Setup with Vignette overlay
       document.body.style.backgroundColor = '#050505';
        
        // 2. Original Three.js setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true so background shows
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        document.body.appendChild(renderer.domElement);

        /*
        const circleGeometry = new THREE.CircleGeometry(0.1, 32);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.set(0, 1.5, 0);
        scene.add(circle);*/

        // 3. New Glassmorphism UI Container
        const uiContainer = document.createElement('div');
        uiContainer.id = 'uiContainer';
        uiContainer.style.cssText = `
            position: absolute; top: 20%; left: 50%;
            transform: translateX(-50%); width: ${isMobile() ? '85%' : '800px'};
            display: flex; flex-direction: column; gap: 15px;
        `;
        const previewImage = document.createElement('div');
        previewImage.id = 'previewImage';
        previewImage.className = 'skeleton-loading';
        previewImage.style.cssText = `
            width: 100%;
            aspect-ratio: 16 / 9;
            background-size: cover;
            background-position: center;
            background-image: url(${bgImages[0]});
            border-radius: 6px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            transition: background-image 0.8s ease-in-out;
            position: relative;
        `;
        previewImage.style.marginBottom = '10px';
        // ADD THIS instead:
        previewImage.style.backgroundImage = 'none'; // hide image while loading

        const img = new Image();
        img.src = bgImages[0];
        img.onload = () => {
            previewImage.classList.remove('skeleton-loading');
            previewImage.style.transition = 'opacity 0.4s ease';
            previewImage.style.opacity = '0';
            previewImage.style.backgroundImage = `url(${bgImages[0]})`;
            // Fade in after swap
            requestAnimationFrame(() => {
                previewImage.style.opacity = '1';
            });
        };

        // Tip Text
        const tipText = document.createElement('div');
        tipText.id = 'tipText';
        tipText.style.cssText = `
            color: #ddd; font-family: Verdana, sans-serif; font-size: 14px;
            text-align: center; font-style: italic; min-height: 20px;
            text-shadow: 1px 1px 2px black;
        `;
        const tips = getGameTips();
        tipText.innerText = tips[0];

        // Loading Bar Container (Glassmorphism)
        const loadingContainer = document.createElement('div');
        loadingContainer.id = 'loadingContainer';
        loadingContainer.style.cssText = `
            height: 15px; background: rgba(0, 0, 0, 0.4);
            border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(5px); overflow: hidden;
        `;

        const progressBar = document.createElement('div');
        progressBar.id = 'progressBar';
        progressBar.style.cssText = `
            width: 0%; height: 100%; background: goldenrod;
            box-shadow: 0 0 10px goldenrod; transition: width 0.2s ease-in-out;
        `;

        // Bottom Info Row (Speed & Percent)
        const infoRow = document.createElement('div');
        infoRow.id = 'infoRow';
        infoRow.style.cssText = `
            display: flex; justify-content: space-between;
            color: white; font-family: Verdana, sans-serif; font-size: 12px;
        `;
        
        const speedText = document.createElement('div');
        speedText.id = 'speedText';
        if (navigator.connection && navigator.connection.downlink) {
            speedText.innerText = `Speed: ${navigator.connection.downlink} Mbps`;
        } else {
            speedText.innerText = `Speed: Unknown`;
        }

        // Append everything
        const loadingText = document.createElement('div');
        loadingText.id = 'loadingText';
        loadingText.innerText = '0%';

        // Append everything
        loadingContainer.appendChild(progressBar);
        infoRow.appendChild(speedText);
        infoRow.appendChild(loadingText);
        
        uiContainer.appendChild(previewImage);
        uiContainer.appendChild(tipText);
        uiContainer.appendChild(loadingContainer);
        uiContainer.appendChild(infoRow);
        document.body.appendChild(uiContainer);

        // 4. Cycle Images and Tips
        bgInterval = setInterval(() => {
            currentImgIndex = (currentImgIndex + 1) % bgImages.length;
            const imgElement = document.getElementById('previewImage');
            if (!imgElement) return;
        
            // Preload next image before swapping
            const nextImg = new Image();
            nextImg.src = bgImages[currentImgIndex];
            nextImg.onload = () => {
                imgElement.style.opacity = '0';
                setTimeout(() => {
                    imgElement.style.backgroundImage = `url(${bgImages[currentImgIndex]})`;
                    imgElement.style.opacity = '1';
                }, 400); // wait for fade out
            };
        
            // Tip fade
            const tipElement = document.getElementById('tipText');
            if (tipElement) {
                tipElement.style.opacity = '0';
                setTimeout(() => {
                    tipElement.innerText = tips[currentImgIndex % tips.length];
                    tipElement.style.opacity = '1';
                }, 1000);
            }
        }, 3000);
        
        // Set camera position
        camera.position.z = 5;

        // Add raycaster and mouse for hover/click handling
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // Handle resizing
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Animation loop for the circle movement
        function animate() {
            animationFrameId = requestAnimationFrame(animate);

            // Move the circle up and down
            const time = performance.now() * 0.001; // Time in seconds
            circle.position.y = Math.sin(time * Math.PI); // Oscillation

            renderer.render(scene, camera);
        }

        animate();

        resolve(); // Resolve immediately, actual loading handled externally
    });
}

export function updateLoadingProgress(progress) {
    const progressBar = document.getElementById('progressBar');
    const loadingText = document.getElementById('loadingText');

    if (progressBar && loadingText) {
        progressBar.style.width = `${progress}%`;
        loadingText.innerText = `Loading... ${progress}%`;
    }

    if (progress > 62) {
        loadingText.style.color = 'black'; // Better visibility when over goldenrod
    } else {
        loadingText.style.color = 'white'; // When mostly over black
    }
    
}


export function hideLoadingScreen() {

    // Add hover and click interactions, and clean up the scene
    return new Promise((resolve) => {    
        const loadingContainer = document.getElementById('loadingContainer');
        if (loadingContainer) {
            loadingContainer.remove();
        }

        const previewImage = document.getElementById('previewImage');

        // 🔲 Create overlay (initially transparent)
        let overlay;
        if (previewImage) {
            overlay = document.createElement('div');
            overlay.id = 'previewOverlay';
            overlay.style.cssText = `
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0);
                border-radius: 6px;
                transition: background 0.5s ease;
                z-index: 1;
                pointer-events: none;
            `;
            previewImage.appendChild(overlay);
        }

        // Add a text element for "Start" (inside the sphere)
        const startTextDiv = document.createElement('div');
        startTextDiv.style.position = 'absolute';
        startTextDiv.style.color = 'white';
        startTextDiv.style.fontFamily = "'Orbitron', sans-serif";
        startTextDiv.style.letterSpacing = '2px';
        startTextDiv.style.fontSize = isMobile() ? '22px' : '36px';
        startTextDiv.style.top = '50%'; 
        startTextDiv.style.left = '50%';
        startTextDiv.style.transform = 'translate(-50%, -50%)';
        startTextDiv.style.display = 'block'; // Hidden until loading completes
        startTextDiv.id = 'loading2';
        startTextDiv.innerText = 'START GAME';
        startTextDiv.style.zIndex = '2';
        if (isMobile()) {
            startTextDiv.style.letterSpacing = '1px';
        }
        if (previewImage) {
            previewImage.appendChild(startTextDiv);
        }
        
        setTimeout(() => {
            if (overlay) {
                overlay.style.background = 'rgba(0, 0, 0, 0.45)';
            }
        }, 50);
        
        //scene.remove(circle);

        const infoRow = document.getElementById('infoRow');
        if (infoRow) infoRow.remove();
        const tipText = document.getElementById('tipText');
        if (tipText) tipText.remove();

        // Add hover effect for the text
        startTextDiv.addEventListener('mouseover', () => {
            startTextDiv.style.color = '#ffe135'; // Change color to yellow
            startTextDiv.style.fontSize = '35px';        
            startTextDiv.style.top = '50%'; 
            startTextDiv.style.transform = 'translate(-50%, -70%)';
        });
          
        startTextDiv.addEventListener('mouseout', () => {
            startTextDiv.style.color = 'white'; // Revert color to white
            startTextDiv.style.fontSize = '30px';
            startTextDiv.style.top = '50%'; 
            startTextDiv.style.transform = 'translate(-50%, -50%)';
        });

        function cleanupLoadingScreen() {
            // 1. Remove all Three.js objects from the scene
            while (scene.children.length > 0) {
                const object = scene.children[0];
        
                // Dispose of geometries and materials to free memory
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach((mat) => mat.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
        
                // Remove the object from the scene
                scene.remove(object);
            }
        
            // 2. Dispose of the renderer to release WebGL resources
            renderer.dispose();
        
            // 3. Remove dynamically created DOM elements
            const startTextDiv = document.getElementById('loading2');
            console.log(startTextDiv);
            const loaderTextDiv = Array.from(document.body.children).find(
                (el) => el.innerText === 'Click to Start'
            );
        
            if (startTextDiv) startTextDiv.remove();
            if (loaderTextDiv) loaderTextDiv.remove();
        
            // Remove the Three.js canvas (renderer.domElement)
            if (renderer.domElement) renderer.domElement.remove();
            
            const previewImg = document.getElementById('previewImage');
            if (previewImg) previewImg.remove();
            const overlay = document.getElementById('previewOverlay');
            if (overlay) overlay.remove();
        
            // 5. Cancel any active animation frames
            //if (animationFrameId) cancelAnimationFrame(animationFrameId);
        
            console.log('Loading screen elements and resources have been cleaned up.');
        }

        // Add click event to resolve and clean up
        startTextDiv.addEventListener('click', () => {
            playAirBalloonSound();
            cleanupLoadingScreen(); 
            resolve();    
          });

        
    });
}

