import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

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

    //glaseplane below tv
    function createGlassPlane(img_path, x , y , z, rot){

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
        scene.add(glassPlane);        

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

            if(rotx == 0){
                xt = x - 1.8;
                yt = y + 0.1;
                zt = z;
            }
            else if(rotx == -0.5){
                xt = x;
                yt = y + 0.1;
                zt = z - 1.8;
            }
            else if(rotx == 0.5){
                xt = x ;
                yt = y + 0.1;
                zt = z + 2.5;
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

    createGlassPlane('', -22.2, 4.5, 3.75, 1);//ffirst back
    createGlassPlane('/assets/image/abcd.jpeg', -22.2, 4.5, -29.8, 0);//first front

    createGlassPlane('/assets/image/blood.jpg', -38, 4.5, -29.8, 0);//second front
    createGlassPlane('', -38, 4.5, 3.75, 1);//second back

    createGlassPlane('/assets/image/sd.png', -52, 4.5, -29.8, 0);//third front
    createGlassPlane('/assets/image/dashboard.png', -52, 4.5, 3.75, 1);//third back

    createGlassPlane('/assets/image/lector.png', -54.6, 4.5, -12.8, 0.5);


    createGlassGround('hello', -22.5, -0.28, -26.5, -0.5, 1);//first front
    createGlassGround('hello', -37.5, -0.28, -26.5, -0.5, 1); //second front
    createGlassGround('hello', -51.5, -0.28, -26.5, -0.5, 1);//third front

    createGlassGround('hello', -22.5, -0.28, 0.55, -0.5, 0);//frist back
    createGlassGround('hello', -37.5, -0.28, 0.55, -0.5, 0);//second back
    createGlassGround('hello', -52.4, -0.28, 0.55, -0.5, 0);//third back

    createGlassGround('hello', -52.5, -0.28, -13.2, -0.5, 0.5);


}