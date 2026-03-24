import * as THREE from 'three';
import { playAirBalloonSound } from './sound';
import { isMobile } from './phone';

// Shared variables for the scene, camera, renderer, and objects
let scene, camera, renderer, sphere, circle, raycaster, mouse;
let animationFrameId; // To store the animation frame ID for cleanup

// Carousel and Tips data
const bgImages = ['public/image/img1.jpg', 'public/image/img2.jpg', 'public/image/img3.jpg'];
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
        const bgContainer = document.createElement('div');
        bgContainer.id = 'loadingBg';
        bgContainer.style.cssText = `
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-size: cover; background-position: center;
            background-image: url(${bgImages[0]});
            transition: background-image 1s ease-in-out;
            z-index: -1; 
            box-shadow: inset 0 0 150px rgba(0,0,0,0.9); /* Vignette effect */
            filter: brightness(0.5);
        `;
        document.body.appendChild(bgContainer);

        // 2. Original Three.js setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true so background shows
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        document.body.appendChild(renderer.domElement);

        const circleGeometry = new THREE.CircleGeometry(0.1, 32);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.set(0, 1.5, 0);
        scene.add(circle);

        // 3. New Glassmorphism UI Container
        const uiContainer = document.createElement('div');
        uiContainer.id = 'uiContainer';
        uiContainer.style.cssText = `
            position: absolute; bottom: 10%; left: 50%;
            transform: translateX(-50%); width: ${isMobile() ? '85%' : '500px'};
            display: flex; flex-direction: column; gap: 10px;
        `;

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

        const loadingText = document.createElement('div');
        loadingText.id = 'loadingText';
        loadingText.innerText = '0%';

        // Append everything
        loadingContainer.appendChild(progressBar);
        infoRow.appendChild(speedText);
        infoRow.appendChild(loadingText);
        
        uiContainer.appendChild(tipText);
        uiContainer.appendChild(loadingContainer);
        uiContainer.appendChild(infoRow);
        document.body.appendChild(uiContainer);

        // 4. Cycle Images and Tips
        bgInterval = setInterval(() => {
            currentImgIndex = (currentImgIndex + 1) % bgImages.length;
            bgContainer.style.backgroundImage = `url(${bgImages[currentImgIndex]})`;
            tipText.innerText = tips[currentImgIndex % tips.length];
        }, 5000);
        
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

        // Add a text element for "Start" (inside the sphere)
        const startTextDiv = document.createElement('div');
        startTextDiv.style.position = 'absolute';
        startTextDiv.style.color = 'white';
        startTextDiv.style.fontFamily = 'Verdana, sans-serif';
        startTextDiv.style.fontSize = '30px';
        startTextDiv.style.top = '50%'; 
        startTextDiv.style.left = '50%';
        startTextDiv.style.transform = 'translate(-50%, -50%)';
        startTextDiv.style.display = 'block'; // Hidden until loading completes
        startTextDiv.id = 'loading2';
        startTextDiv.innerText = 'START';
        
        document.body.appendChild(startTextDiv);

        
        scene.remove(circle);
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
