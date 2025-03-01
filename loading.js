import * as THREE from 'three';
import { playAirBalloonSound } from './sound';
import { isMobile } from './phone';

// Shared variables for the scene, camera, renderer, and objects
let scene, camera, renderer, sphere, circle, raycaster, mouse;
let animationFrameId; // To store the animation frame ID for cleanup

export function showLoadingScreen() {
    return new Promise((resolve) => {
        // Create loading screen elements

        document.body.style.backgroundColor = 'black';

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Add a white circle that moves up and down
        const circleGeometry = new THREE.CircleGeometry(0.1, 32);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White
        circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.set(0, 1.5, 0); // Start above the sphere
        scene.add(circle);

        const loadingContainer = document.createElement('div');
        loadingContainer.id = 'loadingContainer';
        loadingContainer.style.position = 'absolute';
        loadingContainer.style.top = '75%';
        loadingContainer.style.left = '50%';
        loadingContainer.style.transform = 'translate(-50%, -50%)';

        if(isMobile()){
            loadingContainer.style.width = '150px';
            loadingContainer.style.height = '20px';
        }
        else{
            loadingContainer.style.width = '300px';
            loadingContainer.style.height = '30px';
        }

        
        loadingContainer.style.background = 'black';
        loadingContainer.style.borderRadius = '10px';
        loadingContainer.style.border = '2px solid goldenrod';
        loadingContainer.style.overflow = 'hidden';

        const progressBar = document.createElement('div');
        progressBar.id = 'progressBar';
        progressBar.style.width = '0%';
        progressBar.style.height = '100%';
        progressBar.style.background = 'goldenrod';
        progressBar.style.transition = 'width 0.2s ease-in-out';

        const loadingText = document.createElement('div');
        loadingText.id = 'loadingText';
        loadingText.style.position = 'absolute';
        loadingText.style.width = '100%';
        loadingText.style.textAlign = 'center';
        loadingText.style.top = '50%';
        loadingText.style.transform = 'translateY(-50%)';
        loadingText.style.fontFamily = 'Verdana, sans-serif';
        loadingText.style.fontSize = '18px';
        loadingText.style.color = 'white';
        loadingText.style.transition = 'color 1s ease-in-out';
        loadingText.innerText = 'Loading... 0%';

        loadingContainer.appendChild(progressBar);
        loadingContainer.appendChild(loadingText);
        document.body.appendChild(loadingContainer);
        
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

    if (progress > 50) {
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