import * as THREE from 'three';
import { playAirBalloonSound } from './sound';

// Shared variables for the scene, camera, renderer, and objects
let scene, camera, renderer, sphere, circle, raycaster, mouse;
let animationFrameId; // To store the animation frame ID for cleanup

export function showLoadingScreen() {
    return new Promise((resolve) => {
        // Initialize the scene, camera, and renderer
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
/*
        // Add a grey sphere to the scene
        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Grey
        sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      */  
        // Add a white circle that moves up and down
        const circleGeometry = new THREE.CircleGeometry(0.1, 32);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White
        circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.set(0, 1.5, 0); // Start above the sphere
        scene.add(circle);
1
        // Create and style the "loading.." text
        const loadingText = document.createElement("div");
        loadingText.innerText = "Loading..";
        loadingText.style.position = "absolute";
        loadingText.style.top = "75%"; // Adjusted for proper positioning1
        loadingText.style.left = "50%";
        loadingText.style.transform = "translate(-50%, -50%)";
        loadingText.style.color = "white";
        loadingText.style.fontSize = "25px";
        loadingText.style.fontFamily = "Verdana, sans-serif";
        loadingText.style.textAlign = "center";
        loadingText.style.animation = "blink 2s infinite";
        loadingText.id = "loading3";

        document.body.appendChild(loadingText);

        // Add CSS for blinking effect
        const style = document.createElement("style");
        style.innerHTML = `
            @keyframes blink {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
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

export function hideLoadingScreen() {

    // Add hover and click interactions, and clean up the scene
    return new Promise((resolve) => {
        // Create text elements for "Click to Start" and "Start"
         /*// Add a text element for "Touch Me" (hidden initially)
        const loaderTextDiv = document.createElement('div');
        loaderTextDiv.style.position = 'absolute';
        loaderTextDiv.style.color = 'white';
        loaderTextDiv.style.fontFamily = 'Arial, sans-serif';
        loaderTextDiv.style.fontSize = '20px';
        loaderTextDiv.style.top = '60%'; // Positioned below the sphere
        loaderTextDiv.style.left = '50%';
        loaderTextDiv.style.transform = 'translate(-50%, -50%)';
        loaderTextDiv.style.display = 'block'; // Hidden by default
        loaderTextDiv.innerText = 'Click to Start';
        //loaderTextDiv.id = 'loading1';
        document.body.appendChild(loaderTextDiv);
*/      
        const loadingText = document.getElementById("loading3");
        loadingText.remove();

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
