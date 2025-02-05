import * as THREE from 'three';

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
            createGlassSphere(28 + (i*5), 8-(i*3), 7, 1);
        }

        else if(i == 3){
            createPortalX(44,1, 7, 0.5);
            createGlassSphere(44,1, 7, 0.5);
        }
        else if(i < 10){
            createPortalX(42 - (i-4)*5, 1.3 + (i-4)*3, 21.4, 1);
            createGlassSphere(42 - (i-4)*5, 1.3 + (i-4)*3, 21.4, 1);
        }
        else if(i == 9){
            createPortalX(16, 17, 21.4, 0.5);
            createGlassSphere(16, 17, 21.4, 0.5);
        }
        
    }
    createGlassSphere(45, 1, 11);
    createGlassSphere(45, 1, 14);
    createGlassSphere(45, 1, 17);
    createGlassSphere(45, 1, 20);
}