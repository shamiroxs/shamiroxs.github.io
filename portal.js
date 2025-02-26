import * as THREE from 'three';

export async function startLink(scene, assets){
    let link;
    function createLink(x, y, z, rot, color = null) {  // Default to null (no color change)
        link = assets[16].scene.clone();
        const initialPosition = new THREE.Vector3(x, y, z);
        link.scale.set(1, 1, 1);
        link.position.copy(initialPosition);
        link.rotation.x = Math.PI * rot;
        link.name = "link " + (x + y + z);
        
        // Apply color only if it's provided
        if (color !== null) {
            link.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();  // Avoid modifying the original model globally
                    child.material.color.set(color);
                }
            });
        }
    
        scene.add(link);
    }
    
    // Call the function without color (keeps original textures/materials)
    createLink(-18.7, -0.4, -24.7, 0.5, 0x121212);
    createLink(-33.5, -0.4, -24.7, 0.5, 0x121212);
    createLink(-48.2, -0.4, -24.7, 0.5, 0x121212);

    //createLink(-18.7, -0.4, -24.8, 0.5, 0x121212);

    //createLink(-18.7, -0.4, -24.8, 0.5, 0x121212);
    //createLink(-18.7, -0.4, -24.8, 0.5, 0x121212);
    //createLink(-18.7, -0.4, -24.8, 0.5, 0x121212);
    
}