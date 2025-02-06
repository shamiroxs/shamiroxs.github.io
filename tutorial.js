import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { isMobile } from './phone';

export async function startTutorial(scene, assets) {
    // Create a glass plane
    const planeGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x808080, // Grey color
        transmission: 0.9,
        opacity: 0.1,
        roughness: 0.1,
        metalness: 0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1 
    });
    function createGlassPlane(input_text, x , y , z, rot){
        const glassPlane = new THREE.Mesh(new THREE.PlaneGeometry(8, 6), planeGlassMaterial);
        glassPlane.position.set(x, y, z);
        glassPlane.rotation.y = Math.PI * rot;
        scene.add(glassPlane);

        let xt, yt, zt;

        // Load a font and create the text
        const fontLoader = new FontLoader();
        fontLoader.load('https://threejs.org/examples/fonts/optimer_regular.typeface.json', (font) => {
            const textGeometry = new TextGeometry(input_text, {
                font: font,
                size: 0.2,
                height: 0.02,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0,
                bevelSize: 0.001,
                bevelOffset: 0,
                bevelSegments: 4
            });
            const textMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF }); // White color
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            if(rot == 0){
                xt = x - 1.8;
                yt = y + 2;
                zt = z;
            }
            else if(rot == -0.5){
                xt = x;
                yt = y + 2 ;
                zt = z - 1.8;
            }
            else if(rot == 0.5){
                xt = x ;
                yt = y + 2;
                zt = z + 2.5;
            }

            textMesh.position.set(xt, yt, zt);
            textMesh.rotation.y = Math.PI * rot;
            scene.add(textMesh);
        });
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

    // Function to create a glass block with text
    function createGlassBlock(letter, x, y, z, rot) {
        // Create the glass block
        const blockGeometry = new THREE.BoxGeometry(1, 1, 0.6);
        const block = new THREE.Mesh(blockGeometry, blockGlassMaterial);
        block.position.set(x, y, z);
        block.rotation.y = Math.PI * rot;
        block.name = 'Tblock ' + letter;
        scene.add(block);

        let xt, yt, zt;
        const fontLoader = new FontLoader();
        // Load a font and create the text
        fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const textGeometry = new TextGeometry(letter, {
                font: font,
                size: 0.5,
                height: 0.05,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            });
            const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // White color
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            if(rot == 0){
                xt = x - 0.30;
                yt = y - 0.15;
                zt = z + 0.06;
            }
            else if(rot == -0.5){
                xt = x + 0.06;
                yt = y - 0.15 ;
                zt = z - 0.30;
            }

            textMesh.rotation.y = Math.PI * rot;
            textMesh.position.set(xt, yt, zt); // Adjust position to place text on the block
            scene.add(textMesh);
        });
    }

    // Function to create a glass block with text
    function createText(input_text, x, y, z, rot) {
        
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
            const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // White color
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            if(rot == 0){
                xt = x ;
                yt = y ;
                zt = z ;
            }
            else if(rot == -0.5){
                xt = x + 0.06;
                yt = y - 0.15 ;
                zt = z - 0.30;
            }
            else if(rot == 0.5){
                xt = x + 0.06;
                yt = y + 0.15 ;
                zt = z - 0.30;
            }

            textMesh.rotation.y = Math.PI * rot;
            textMesh.position.set(xt, yt, zt); // Adjust position to place text on the block
            scene.add(textMesh);
        });
    }


    // Create Planes
    createGlassPlane('Welcome!\nPress SPACE KEY to view\nPress                              to move', 0, 0, -2.8, 0);
    createGlassPlane('Left                           Right\n\n\n\n\n\n     Hint:Undo view!', 0, 0, -10.55, 0);
    createGlassPlane('\nFly                                      Fall', 2.8, 0.2, -6.4, -0.5);
    createGlassPlane('Mouse:\n<> Click & Drag to move around\n<> Scroll to Zoom', -3, 0.2, -6.4, 0.5);

    // Create blocks
    if(isMobile){
        createGlassBlock('↑', 0, 1, -2.4, 0);
        createGlassBlock('←', -1, 0, -2.4, 0);
        createGlassBlock('↓', 0, 0, -2.4, 0);
        createGlassBlock('→', 1, 0, -2.4, 0);
        createGlassBlock('←←', -1.8, 1, -10.55, 0);
        createGlassBlock('→→', 1, 1, -10.55, 0);
        createGlassBlock('U', 2.8, 1, -8, -0.5);
        createGlassBlock('D', 2.8, 1, -4.8, -0.5);
    }
    else{
        createGlassBlock('W', 0, 1, -2.4, 0);
        createGlassBlock('A', -1, 0, -2.4, 0);
        createGlassBlock('S', 0, 0, -2.4, 0);
        createGlassBlock('D', 1, 0, -2.4, 0);
        createGlassBlock('<-', -1.8, 1, -10.55, 0);
        createGlassBlock('->', 1, 1, -10.55, 0);
        createGlassBlock('Q', 2.8, 1, -8, -0.5);
        createGlassBlock('E', 2.8, 1, -4.8, -0.5);
    }
    
    // Create plane of blocks
// Side 1: From left to right along the x-axis
    for (let x = -2.5; x <= 2.5; x += 0.5) {
        createGlassBlock('-', x, 3.7, -3.2, -0.5);
    }

// Side 2: From top to bottom along the z-axis
    for (let z = -3.7; z >= -9.2; z -= 0.5) {
        createGlassBlock('<', -2.5, 3.7, z, -0.5);
    }

// Side 3: From right to left along the x-axis
    for (let x = 2.5; x >= -2.5; x -= 0.5) {
        createGlassBlock('-', x, 3.7, -9.2, -0.5);
    }

// Side 4: From bottom to top along the z-axis
    for (let z = -9.2; z <= -3.7; z += 0.5) {
        createGlassBlock('<', 2.5, 3.7, z, -0.5);
    }

// Fill the interior area of the rectangle
    for (let x = -2; x <= 2; x += 0.5) { // Loop through the x-axis (inside boundaries of sides 1 and 3)
        for (let z = -3.7; z >= -9.2; z -= 0.5) { // Loop through the z-axis (inside boundaries of sides 2 and 4)
            createGlassBlock('$', x, 3.7, z, -0.5); // Place blocks in the interior area
        }
    }

    //create texts/instructions 
    for (let y = -0.5; y <= 2; y += 0.5) { // Loop through the x-axis (inside boundaries of sides 1 and 3)
        createText("^", 2.7, y, -6.4, -0.5);
    }

    createText("Projects", -4.7, 6.3, -3.2, 0.5);
    createText("Fun!", 4.7, 6.3, -7.2, -0.5);

}
