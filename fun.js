import * as THREE from 'three';

export async function drawCharacterSkin(scene, chara) {
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
            skin.position.set(22.6 + i * 15, 0.6, -39.6); // Spread out skins in the scene
        }
        else if(i == 6){
            skin.position.set(37.2, 9, -53.5);
        }
        else{
            skin.position.set(22.6 + (i-3) * 15, 0.6, -26.5)
        }
        skin.name = `character ${i}`; // Assign a unique name
        scene.add(skin);
    }

    console.log('All character skins have been added to the scene.');
}
