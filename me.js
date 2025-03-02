

export async function drawMe(scene, assets){

    //GitHub
    let logo = assets[17].scene.clone();
    logo.scale.set(1.2, 1.2, 1.2);
    logo.name = "logo 1";
    logo.position.set(-0.4, 6, -29);
    scene.add(logo);

    //LInkedIn
    logo = assets[18].scene.clone();
    logo.scale.set(1.2, 1.2, 1.2);
    logo.name = "logo 2";
    logo.position.set(-0.4, 9, -40);
    scene.add(logo);

    //Whatsapp
    logo = assets[19].scene.clone();
    logo.scale.set(1.2, 1.2, 1.2);
    logo.name = "logo 3";
    logo.position.set(-0.4, 12.6, -51);
    scene.add(logo);

    //Gmail
    logo = assets[20].scene.clone();
    logo.scale.set(8, 8, 8);
    logo.name = "logo 4";
    logo.position.set(-0.4, 22, -62);
    scene.add(logo);

    //Coffee
    logo = assets[21].scene.clone();
    logo.scale.set(12, 12, 12);
    logo.name = "logo 5";
    logo.position.set(0, 6, 7);
    logo.rotation.y = Math.PI ;
    scene.add(logo);

    //share
    logo = assets[8].scene.clone();
    logo.scale.set(1, 1, 1);
    logo.name = "logo 6";
    logo.position.set(0, 3, 20);
    logo.rotation.x = Math.PI * -0.25 ;
    logo.rotation.y = Math.PI * -0.25 ;
    scene.add(logo);
}