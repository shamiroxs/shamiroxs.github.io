import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

//glaseplane on tv
function createGlassPlane(scene, img_path, x , y , z, rot){

    const textureLoader = new THREE.TextureLoader();
    const imageTexture = textureLoader.load(img_path);

     // Create a glass plane
    const planeGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, // white color
        transmission: 0.9,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
        map: imageTexture
    });

    const glassPlane = new THREE.Mesh(new THREE.PlaneGeometry(11.5, 6.5), planeGlassMaterial);
    glassPlane.position.set(x, y, z);
    glassPlane.rotation.y = Math.PI * rot;
    glassPlane.name = 'screen ' + (x+y+z);
    scene.add(glassPlane);        

}       


export async function startProject(scene, assets) {

    let tv;
    // Add the tv
    function createTv(x, y, z, rot){
        tv = assets[10].scene.clone();
        const initialPosition = new THREE.Vector3(x, y, z);
        tv.scale.set(6, 6, 6);
        tv.position.copy(initialPosition);
        tv.rotation.y = Math.PI * rot;
        tv.name = "TV" + (x+y+z);
        scene.add(tv);


        const tvBox = new THREE.Box3().setFromObject(tv);
    }

    //create powerstation
    let power;
    function createPower(x, y, z, rot){
        power = assets[14].scene.clone();
        const initialPosition = new THREE.Vector3(x, y, z);
        power.scale.set(1.5, 1.5, 1.5);
        power.position.copy(initialPosition);
        power.rotation.y = Math.PI * rot;
        power.name = "power " + (x+y+z);
        scene.add(power);    
    }

    //glaseplane below tv
    function createGlassGround(input_text, x , y , z, rotx, roty){

         // Create a glass plane
        const planeGlassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x121212, // black color
            transmission: 0.9,
            opacity: 0.1,
            roughness: 0.1,
            metalness: 0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            side: THREE.DoubleSide
        });

        const glassPlane = new THREE.Mesh(new THREE.PlaneGeometry(13.5, 12.8), planeGlassMaterial);
        glassPlane.position.set(x, y, z);
        glassPlane.rotation.x = Math.PI * rotx;
        glassPlane.name = 'glass ground ' + (x + y+ z);
        scene.add(glassPlane);        

        let xt, yt, zt;

        // Load a font and create the text
        const fontLoader = new FontLoader();
        fontLoader.load('https://threejs.org/examples/fonts/optimer_regular.typeface.json', (font) => {
            const textGeometry = new TextGeometry(input_text, {
                font: font,
                size: 0.26,
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

            if(roty == 0){
                xt = x + 4.5;
                yt = y + 0.1;
                zt = z + 1.8;
            }
            else if(roty == 1){
                xt = x - 4.5;
                yt = y + 0.1;
                zt = z - 1.8;
            }
            else if(roty == 0.5){
                xt = x - 0.8 ;
                yt = y + 0.1;
                zt = z + 4.5;
            }

            textMesh.position.set(xt, yt, zt);
            textMesh.rotation.x = Math.PI * rotx;

            if(roty == 0){
                textMesh.rotation.z = Math.PI * rotx * 2;
            }
            else if(roty == 0.5){
                textMesh.rotation.z = -Math.PI * rotx;
            }
            else{
                //No rotation for front
            }
            
            scene.add(textMesh);
        });
    }

    createTv(-22.2, -0.4, 2, 1);
    createTv(-22.2, -0.4, -28, 0);

    createTv(-38, -0.4, -28, 0);
    createTv(-38, -0.4, 2, 1);

    createTv(-52, -0.4, -28, 0);
    createTv(-52, -0.4, 2, 1);
    
    createTv(-53, -0.4, -12.8, 0.5);

    createGlassPlane(scene, '/assets/image/hello.jpeg', -22.2, 4.1, 3.75, 1);//ffirst back
    createGlassPlane(scene, '/assets/image/abcd.jpeg', -22.2, 4.1, -29.8, 0);//first front

    createGlassPlane(scene, '/assets/image/blood.jpg', -38, 4.1, -29.8, 0);//second front
    createGlassPlane(scene, '/assets/image/bot.jpg', -38, 4.1, 3.75, 1);//second back

    createGlassPlane(scene, '/assets/image/sd.png', -52, 4.1, -29.8, 0);//third front
    createGlassPlane(scene, '/assets/image/dashboard.png', -52, 4.1, 3.75, 1);//third back

    createGlassPlane(scene, '/assets/image/lector.png', -54.8, 4.1, -12.8, 0.5);


    createGlassGround('Developed an AI-driven dance proficiency assessment system \n\nusing Python, OpenCV, and MediaPipe to detect body movement, \n\nscore dance performance in real-time, and display a dynamic \n\nleaderboard through Pygame to encourage participants to \n\ndance with confidence at a tech fest.', -22.5, -0.28, -26.5, -0.5, 1);//first front
    createGlassGround('Built a multiplayer web game using Django, JavaScript, HTML, \n\nand CSS that lets players join rooms and race to spell CODE. \n\nFeatures real-time card swapping, turn-based logic, and \n\nmobile-responsive UI.', -37.5, -0.28, -26.5, -0.5, 1); //second front
    createGlassGround('Developed a Temperature Conversion Program, \n\nGuessing Game, Simple Contact Management System, \n\nSudoku Solver, Web Scraping Tool', -51.5, -0.28, -26.5, -0.5, 1);//third front

    createGlassGround('Hello', -22.5, -0.28, 0.55, -0.5, 0);//frist back
    createGlassGround('Developed and deployed a Deepfake Detection Bot using PyTorch \n\n(EfficientNetV2), MTCNN, and OpenCV, with Facebook Graph API \n\nand Google Cloud (Flask, Pub/Sub, Colab) for GPU-based inference, \n\nleading a team of three.', -37.5, -0.28, 0.55, -0.5, 0);//second back
    createGlassGround('Developed a real-time multiplayer 3D RPG using Three.js, Cannon.js, \n\nand WebSockets players explore the fantasy world, challenge each other to duels, \n\nDesigned for both fun and learning, fully browser-based and mobile-aware.', -52.4, -0.28, 0.55, -0.5, 0);//third back

    createGlassGround('\n\nDeveloped an automated eBook-to-video conversion tool \n\nusing Python, integrating file processing, progress tracking, \n\nand multimedia generation with a user-friendly GUI.', -52.5, -0.28, -13.2, -0.5, 0.5);

    ////////////////// POWER STATTION \\\\\\\\\\\\\\\\\\\\

    createPower(-38, 0.1, -13, -0.5);
    createPower(-36, 0.1, -13, 0.5);

    createPower(-23, 0.1, -13, -0.5);
    createPower(-21, 0.1, -13, 0.5);
}
