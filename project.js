import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { TextureLoader } from 'three';


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
    function createGlassPlane(input_text, img_path, x , y , z, rot){

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

            if(rot == 0){
                xt = x - 1.8;
                yt = y + 2;
                zt = z;
            }
            else if(rot == -0.5){
                xt = x;
                yt = y + 2 ;
                zt = z - 1.8;
            }
            else if(rot == 0.5){
                xt = x ;
                yt = y + 2;
                zt = z + 2.5;
            }

            textMesh.position.set(xt, yt, zt);
            textMesh.rotation.y = Math.PI * rot;
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

    createGlassPlane('', -22.2, 4.5, 3.75, 1);
    createGlassPlane('', -22.2, 4.5, -29.8, 0);

    createGlassPlane('', -38, 4.5, -29.8, 0);
    createGlassPlane('', -38, 4.5, 3.75, 1);

    createGlassPlane('', -52, 4.5, -29.8, 0);
    createGlassPlane('', -52, 4.5, 3.75, 1);

    createGlassPlane('', '/assets/image/image1.png', -54.6, 4.5, -12.8, 0.5);



}