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
        scene.add(tv);

        const tvBox = new THREE.Box3().setFromObject(tv);
    }

    createTv(-22.2, 0, 2, 1);
    createTv(-22.2, 0, -28, 0);

}