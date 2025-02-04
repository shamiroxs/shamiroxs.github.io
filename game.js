import * as THREE from 'three';

export function startGame(scene, assets) {
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
        const playgroundPortal = new THREE.Mesh(portalGeometry, portalMaterial);
    
        playgroundPortal.position.set(x, y, z);
        playgroundPortal.rotation.y = (Math.PI /2)* rot ;
        playgroundPortal.name = "ring "+(x+y+z);
        scene.add(playgroundPortal);
    
        // Create bounding boxes for portals
        const playgroundPortalOuterBox = new THREE.Box3().setFromObject(playgroundPortal);
        const playgroundPortalHoleBox = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(-5, 1, 0), new THREE.Vector3(0.5, 0.5, 0.5));
       
    }

    //add portal and coins
    for(let i=0 ; i<10 ; i++){
        if(i < 3){
            createPortalX(28 + (i*5), 8-(i*3), 7, 1);
        }

        else if(i == 3){
            createPortalX(44,1, 7, 0.5);
        }
        else if(i < 10){
            createPortalX(42 - (i-4)*5, 1.3 + (i-4)*3, 21.4, 1)
        }
        else if(i == 9){
            createPortalX(16, 17, 21.4, 0.5)
        }
        
    }
}

/*

            // Check collision with outer part of portals and allow movement through the hole
            if (characterBox.intersectsBox(playgroundPortalOuterBox) && !characterBox.intersectsBox(playgroundPortalHoleBox)) {
                character.position.copy(previousPosition);
            }
            if (characterBox.intersectsBox(projectsPortalOuterBox) && !characterBox.intersectsBox(projectsPortalHoleBox)) {
                character.position.copy(previousPosition);

            
        playgroundPortal.rotation.z += 0.01;
        projectsPortal.rotation.z -= 0.01;
            }*/
