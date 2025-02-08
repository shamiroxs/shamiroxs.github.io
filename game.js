import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { checkMobile, gameFinished, isMobile } from './phone';

export async function startGame(scene, assets) {
    const portal = assets[13].scene.clone();
    portal.name = 'portal';
    portal.position.set(22, 0, 2);
    portal.scale.set(1, 1, 1);
    scene.add(portal);

}

export async function playGame(scene){

    function createPortalX(x, y, z, rot){

        // Add portals (playground and projects)
        const portalGeometry = new THREE.TorusGeometry(1.5, 0.2, 16, 100);
        const portalMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
        const ring = new THREE.Mesh(portalGeometry, portalMaterial);
        
        ring.position.set(x, y, z);
        ring.rotation.y = (Math.PI / 2) * rot;
        ring.name = "ring " + (x + y + z);
        scene.add(ring);
    
    }
    // Create a glass material for the blocks
    const blockGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFFFFFF, // White color
        transmission: 0.9,
        opacity: 0.1,
        roughness: 0.1,
        metalness: 0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    function createGlassSphere(x, y, z) {
        // Create the glass sphere geometry
        const sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32);
        const sphere = new THREE.Mesh(sphereGeometry, blockGlassMaterial);
        
        // Set the position of the sphere
        sphere.position.set(x, y, z);
        sphere.name = "reward "+ (x+y+z);
        
        // Add the sphere to the scene
        scene.add(sphere);
    }

    //add portal and coins
    for(let i=0 ; i<10 ; i++){
        if(i < 3){
            createPortalX(28 + (i*5), 8-(i*3), 7, 1);
            createGlassSphere(28 + (i*5), 8-(i*3), 7);
        }

        else if(i == 3){
            createPortalX(44,1.8, 8, 1/10);
            createGlassSphere(44,1.8, 8);
        }
        else if(i < 9){
            createPortalX(42 - (i-4)*5, 1.7 + (i-4)*3, 21.4, 1);
            createGlassSphere(42 - (i-4)*5, 1.7 + (i-4)*3, 21.4);
        }
        else if(i == 9){
            createPortalX(16, 17, 21.4, 1);
            createGlassSphere(16, 17, 21.4);
        }
        
    }
    createGlassSphere(45, 1, 11);
    createGlassSphere(45, 1, 14);
    createGlassSphere(45, 1, 17);
    createGlassSphere(45, 1, 20);
}

// Create a container for the message
const messageDiv = document.createElement("div");
messageDiv.style.position = "absolute";
messageDiv.style.left = "50%";
messageDiv.style.transform = "translate(-50%, -50%)";
messageDiv.style.color = "white";
messageDiv.style.fontFamily = "Arial, sans-serif";
messageDiv.style.padding = "10px";
messageDiv.style.background = "rgba(0, 0, 0, 0.7)";
messageDiv.style.borderRadius = "10px";
messageDiv.style.textAlign = "center";
messageDiv.style.opacity = "0"; // Initially hidden
messageDiv.style.transition = "opacity 1s";

if(isMobile()){
    messageDiv.style.top = "60%";
    messageDiv.style.fontSize = "20px";
}
else{
    messageDiv.style.top = "80%";
    messageDiv.style.fontSize = "24px";
}
 
document.body.appendChild(messageDiv);

function showMessage(text, delay, callback) {
     setTimeout(() => {
         messageDiv.innerHTML = text;
         messageDiv.style.opacity = "1"; // Fade in
         setTimeout(() => {
             messageDiv.style.opacity = "0"; // Fade out
             if (callback) setTimeout(callback, 1000); // Wait for fade-out before next step
         }, 2500);
     }, delay);
}

export function drawFinish(scene) {

    // Show messages without blocking other animations
    showMessage("Well done! You have conquered this challenge.", 20, () => {
        showMessage("You have unlocked a new skill:<br>Portal Travel!", 500, () => {
            showMessage("Press P + (1,2,3) to teleport.", 250, () =>{
                document.body.removeChild(messageDiv);
            });
        });
    });

    gameFinished();
    checkMobile();
}

export function skinText(scene){
    showMessage("Skin Changed!", 20, () => {
    });
}
