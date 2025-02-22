import * as THREE from 'three';

export async function drawCharacterSkin(scene, chara, assets) {
    // Ensure chara array has all seven skins
    if (!chara || chara.length < 7) {
        console.error('Not enough character skins provided.');
        return;
    }

    // Add each skin model to the scene with a unique name
    for (let i = 0; i < 7; i++) {
        let skin = chara[i].scene.clone(); // Clone the model to avoid modifying the original
        skin.scale.set(0.03, 0.03, 0.03);
        if(i < 3){
            skin.position.set(22.63 + i * 15, 7.8, -40.4); // Spread out skins in the scene
        }
        else if(i == 6){
            skin.position.set(37.2, 9, -53.5);
        }
        else{
            skin.position.set(22.63 + (i-3) * 15, 7.8, -26.5)
        }
        skin.name = `character ${i}`; // Assign a unique name
        scene.add(skin);
    }

    console.log('All character skins have been added to the scene.');

    // Add pyramid
    let pyramid ;
    
    for (let i = 0; i < 6; i++) {
        let pyramid = assets[12].scene.clone();
        pyramid.scale.set(4.1, 4.1, 4.1);
        pyramid.name = `pyramid- ${i}`;

        if(i < 3){
            pyramid.position.set(22.55 + i * 15, 0.8, -40.5); // Spread out skins in the scene
        }
        else{
            pyramid.position.set(22.55 + (i-3) * 15, 0.8, -26.5)
        }

        scene.add(pyramid);
    }

    let tailor = assets[15].scene.clone();
    tailor.scale.set(4.5, 4.5, 4.5);
    tailor.name = "tailor";
    tailor.position.set(22.55, 0, -14);
    tailor.rotation.y = -Math.PI * 0.5;
    scene.add(tailor);

}
