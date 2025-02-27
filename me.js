

export async function drawMe(scene, assets){

    //GitHub
    let logo = assets[17].scene.clone();
    logo.scale.set(1.5, 1.5, 1.5);
    logo.name = "logo 1";
    logo.position.set(-0.4, 2, -29);
    scene.add(logo);

    //LInkedIn
    logo = assets[18].scene.clone();
    logo.scale.set(1, 1, 1);
    logo.name = "logo 2";
    logo.position.set(-0.4, 2, -39);
    scene.add(logo);

    //Whatsapp
    logo = assets[19].scene.clone();
    logo.scale.set(1, 1, 1);
    logo.name = "logo 3";
    logo.position.set(-0.4, 2, -49);
    scene.add(logo);

    //Gmail
    logo = assets[20].scene.clone();
    logo.scale.set(1, 1, 1);
    logo.name = "logo 4";
    logo.position.set(-0.4, 2, -59);
    scene.add(logo);
}