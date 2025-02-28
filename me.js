

export async function drawMe(scene, assets){

    //GitHub
    let logo = assets[17].scene.clone();
    logo.scale.set(1, 1, 1);
    logo.name = "logo 1";
    logo.position.set(-0.4, 6, -29);
    scene.add(logo);

    //LInkedIn
    logo = assets[18].scene.clone();
    logo.scale.set(1, 1, 1);
    logo.name = "logo 2";
    logo.position.set(-0.4, 9, -40);
    scene.add(logo);

    //Whatsapp
    logo = assets[19].scene.clone();
    logo.scale.set(1, 1, 1);
    logo.name = "logo 3";
    logo.position.set(-0.4, 12, -51);
    scene.add(logo);

    //Gmail
    logo = assets[20].scene.clone();
    logo.scale.set(6, 6, 6);
    logo.name = "logo 4";
    logo.position.set(-0.4, 20, -62);
    scene.add(logo);
}