import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

//glaseplane on tv
async function createGlassPlane(scene, img_path, x , y , z, rot){

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

        const glassPlane = new THREE.Mesh(new THREE.PlaneGeometry(12.5, 11.7), planeGlassMaterial);
        glassPlane.position.set(x, y, z);
        glassPlane.rotation.x = Math.PI * rotx;
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

    createTv(-22.2, 0, 2, 1);
    createTv(-22.2, 0, -28, 0);

    createTv(-38, 0, -28, 0);
    createTv(-38, 0, 2, 1);

    createTv(-52, 0, -28, 0);
    createTv(-52, 0, 2, 1);
    
    createTv(-53, 0, -12.8, 0.5);

    createGlassPlane(scene, '', -22.2, 4.5, 3.75, 1);//ffirst back
    createGlassPlane(scene, '/assets/image/abcd.jpeg', -22.2, 4.5, -29.8, 0);//first front

    createGlassPlane(scene, '/assets/image/blood.jpg', -38, 4.5, -29.8, 0);//second front
    createGlassPlane(scene, '', -38, 4.5, 3.75, 1);//second back

    createGlassPlane(scene, '/assets/image/sd.png', -52, 4.5, -29.8, 0);//third front
    createGlassPlane(scene, '/assets/image/dashboard.png', -52, 4.5, 3.75, 1);//third back

    createGlassPlane(scene, '/assets/image/lector.png', -54.6, 4.5, -12.8, 0.5);


    createGlassGround('Developed an AI-driven dance proficiency assessment system \n\nusing Python, OpenCV, and MediaPipe to detect body movement, \n\nscore dance performance in real-time, and display a dynamic \n\nleaderboard through Pygame to encourage participants to \n\ndance with confidence at a tech fest.', -22.5, -0.28, -26.5, -0.5, 1);//first front
    createGlassGround('Implemented a web platform with HTML, CSS, JavaScript, PHP, \n\nand MySQL to connect blood donors with hospitals and individuals. \n\nThe system enables donors to register and search for donation \n\nopportunities and allows hospital staff to manage blood inventory\n\n and requests, enhancing community participation in blood drives \n\nand improving resource management for healthcare facilities.', -37.5, -0.28, -26.5, -0.5, 1); //second front
    createGlassGround('Developed a Temperature Conversion Program, \n\nGuessing Game, Simple Contact Management System, \n\nSudoku Solver, Web Scraping Tool', -51.5, -0.28, -26.5, -0.5, 1);//third front

    createGlassGround('hello', -22.5, -0.28, 0.55, -0.5, 0);//frist back
    createGlassGround('hello', -37.5, -0.28, 0.55, -0.5, 0);//second back
    createGlassGround('Created a Power BI dashboard from a workshop by \n\nJatan Shah, including certificate, dashboard file, and notes.', -52.4, -0.28, 0.55, -0.5, 0);//third back

    createGlassGround('Developed an automated eBook-to-video conversion tool \n\nusing Python, integrating file processing, progress tracking, \n\nand multimedia generation with a user-friendly GUI.', -52.5, -0.28, -13.2, -0.5, 0.5);

    ////////////////// POWER STATTION \\\\\\\\\\\\\\\\\\\\

    createPower(-38, 0.1, -13, -0.5);
    createPower(-36, 0.1, -13, 0.5);

    createPower(-23, 0.1, -13, -0.5);
    createPower(-21, 0.1, -13, 0.5);
}