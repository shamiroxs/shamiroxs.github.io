import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

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

    function createText(input_text, x, y, z, roty, rotx) {
        
        let xt, yt, zt;
        const fontLoader = new FontLoader();
        // Load a font and create the text
        fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const textGeometry = new TextGeometry(input_text, {
                font: font,
                size: 1.2,
                height: 0.05,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            });
            const textMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xFFFFFF,
                transparent: true, // Enable transparency
                opacity: 0.1
            });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            if(roty == 0){
                xt = x ;
                yt = y ;
                zt = z ;
            }
            else if(roty == -0.5){
                xt = x + 0.06;
                yt = y - 0.15 ;
                zt = z - 0.30;
            }
            else if(roty == 0.5){
                xt = x + 0.06;
                yt = y + 0.15 ;
                zt = z - 0.30;
            }

            textMesh.rotation.y = Math.PI * roty;
            textMesh.rotation.x = Math.PI * rotx;
            textMesh.position.set(xt, yt, zt); // Adjust position to place text on the block
            scene.add(textMesh);
        });
    }

    
    // normal link
    for (let y = -0.5; y < 2; y += 0.5) { // Loop through the x-axis (inside boundaries of sides 1 and 3)
        createText("^", -19.2, y+2, -23.3, 0, 1);
    }
    createLink(-18.7, -0.4, -24.7, 0.5, 0x121212);

    for (let y = -0.5; y < 2; y += 0.5) { // Loop through the x-axis (inside boundaries of sides 1 and 3)
        createText("^", -34, y+2, -23.3, 0, 1); //-0.5, -1.4
    }
    createLink(-33.5, -0.4, -24.7, 0.5, 0x121212);

    for (let y = -0.5; y < 2; y += 0.5) { // Loop through the x-axis (inside boundaries of sides 1 and 3)
        createText("^", -48.9, y+2, -23.3, 0, 1); //-0.5, -1.4
    }
    createLink(-48.4, -0.4, -24.7, 0.5, 0x121212);

                        ////////3\\\\\\\

    for (let y = -0.5; y < 2; y += 0.5) { // Loop through the x-axis (inside boundaries of sides 1 and 3)
        createText("^", -48.9, y+2, -16.8, 0, 1); //-0.5, +1.4
    }
    createLink(-48.4, -0.4, -18.2, 0.5, 0x121212);

                        //////1\\\\\\

    for (let y = -0.5; y < 2; y += 0.5) { // Loop through the x-axis (inside boundaries of sides 1 and 3)
        createText("^", -19.2, y+2, -2.9, 0, 1);
    }
    createLink(-18.7, -0.4, -4.3, 0.5, 0x121212);

    for (let y = -0.5; y < 2; y += 0.5) { // Loop through the x-axis (inside boundaries of sides 1 and 3)
        createText("^", -34, y+2, -2.9, 0, 1); //-0.5, -1.4
    }
    createLink(-33.5, -0.4, -4.3, 0.5, 0x121212);

    for (let y = -0.5; y < 2; y += 0.5) { // Loop through the x-axis (inside boundaries of sides 1 and 3)
        createText("^", -48.9, y+2, -2.9, 0, 1); //-0.5, -1.4
    }
    createLink(-48.4, -0.4, -4.3, 0.5, 0x121212);

    
    // extra link
    createLink(-55.2, -0.4, -24.7, 0.5, 0x121212);

    createLink(-48.4, -0.4, -11, 0.5, 0x121212);
    
}