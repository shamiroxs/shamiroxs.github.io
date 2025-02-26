import * as THREE from 'three';
import { playClickSound, playAirBalloonSound, 
    playEndSound, playResetSound, playBackgroundMusic, 
    playOceanSound, playHornSound, playGlassSound, 
    playScreenSound, playNightMusic, playAirBalloonFallSound,
    playMoveSound, playSkinSound, playSparkSound, playTailorSound,
    stopTailorSound} from './sound';
import TWEEN from '@tweenjs/tween.js';
import { startTutorial } from './tutorial';
import { hideLoadingScreen, showLoadingScreen } from './loading.js';
import { startProject } from './project';
import { checkMobile, isMobile } from './phone.js';
import { drawCharacterSkin } from './fun';
import { startGame, playGame, drawFinish, skinText } from './game';
import { startStory, endStory } from './story';
import { projectStory, stopStory, powerOff, powerTouch } from './description';
import { startLink } from './portal';


export async function initScene(assets, chara) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Add directional lights at four corners
    const light1 = new THREE.DirectionalLight(0xffffff, 0.25);
    light1.position.set(12, 10, -8);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.25);
    light2.position.set(-12, 10, 8);
    scene.add(light2);

    const light3 = new THREE.DirectionalLight(0xffffff, 0.25);
    light3.position.set(12, 10, 8);
    scene.add(light3);

    const light4 = new THREE.DirectionalLight(0xffffff, 1);
    light4.position.set(-12, 10, -8);
    scene.add(light4);

    // Add ground
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x404040 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.set(0, -12, 0);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Add the character model
    let character = assets[0].scene;
    let initialPosition = new THREE.Vector3(-30,1.6,-11); //0,0.6,0.8 || -30,1.6,-11 || 22, 0.6,-6)
    character.scale.set(0.03, 0.03, 0.03);
    character.position.copy(initialPosition);
    character.name = 'character';
    scene.add(character);

    //recent skin
    let savedSkinIndex = localStorage.getItem('selectedSkin') ? parseInt(localStorage.getItem('selectedSkin')) : 3;

    if (chara[savedSkinIndex]) {
        while (character.children.length > 0) {
            character.remove(character.children[0]);
        }
        chara[savedSkinIndex].scene.children.forEach(child => {
            character.add(child.clone());
        });
    }

    // Add a torch light to the character
    const torchLight = new THREE.SpotLight(0xffa95c, 2);
    torchLight.angle = Math.PI / 3.5;
    torchLight.penumbra = 0.1;
    torchLight.decay = 2;
    torchLight.distance = 50;
    torchLight.position.set(0, 5, 0);
    torchLight.target = character;
    character.add(torchLight);

    // Add the background model
    let background = assets[2].scene;
    background.scale.set(0.006, 0.006, 0.006);
    background.position.set(0, -0.3, 0); // Adjust position above the ground
    scene.add(background);

    await startTutorial(scene, assets);
    await startProject(scene, assets);
    await drawCharacterSkin(scene, chara, assets);
    await startGame(scene, assets);
    await startLink(scene, assets);

    // Add a skybox
    function toggleDarkMode() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        updateSceneLighting(isDarkMode);
    }


    let originalIntensities;
    let isDarkMode = false ;

    //power station
    const powers = scene.children.filter(obj => obj.name.startsWith('power '));
    powers.forEach(power => {
        power.boundingBox = new THREE.Box3().setFromObject(power);

        const powerLight = new THREE.SpotLight(0xffa95c, 2);
        powerLight.angle = Math.PI / 3.5;
        powerLight.penumbra = 0.1;
        powerLight.decay = 2;
        powerLight.distance = 50;
        powerLight.intensity = 50; 

        
        powerLight.position.set(0, 2.8, 0);
        powerLight.target = power;
        powerLight.visible = false;
    
        power.powerLight = powerLight ;
        power.add(powerLight);
    });
    
    function updateSceneLighting(isDarkMode) {
            if (isDarkMode) {
                ambientLight.intensity = 0.4;
                light1.intensity = 0.08;
                light2.intensity = 0.08;
                light3.intensity = 0.08;
                light4.intensity = 0.2;
                torchLight.visible = true; 

                powers.forEach(power => {
                    power.powerLight.visible = false;
                });

                scene.background = assets[11]; // Night sky
            } else {
                ambientLight.intensity = 0.8;
                light1.intensity = 0.25;
                light2.intensity = 0.25;
                light3.intensity = 0.25;
                light4.intensity = 1;
                torchLight.visible = false;
                scene.background = assets[1]; // Day sky

                powers.forEach(power => {
                    power.powerLight.visible = false;
                });
            }
            originalIntensities = {
                ambientLight: ambientLight.intensity,
                light1: light1.intensity,
                light2: light2.intensity,
                light3: light3.intensity,
                light4: light4.intensity
            };
    }
    
    // Car positions and movement ranges
    const carPositions = [
        { x: 0, zStart: 35, zEnd: -60 },
        { x: -15, zStart: 35, zEnd: -60 },
        { x: -30, zStart: 35, zEnd: -60 },
        { x: -45, zStart: 35, zEnd: -60 },
        { x: -59, zStart: 35, zEnd: -60 },
        { x: 15, zStart: 35, zEnd: -60 },
        { x: 30, zStart: 35, zEnd: -60 },
        { x: 45, zStart: 35, zEnd: -60 },
        { x: 59.5, zStart: 35, zEnd: -60 }
    ];

    // Add cars
    const cars = [];
    for (let i = 0; i < 9; i++) {
        const carModelIndex = Math.floor(Math.random() * 4) + 3; // Randomly pick a car model from assets[3] to assets[6]
        const car = assets[carModelIndex].scene.clone();
        car.scale.set(0.1, 0.1, 0.1);

        // Set initial position
        const position = carPositions[i];
        const initialZ = position.zStart + Math.random() * (position.zEnd - position.zStart - 1);
        car.position.set(position.x, 0, Math.min(position.zStart, position.zEnd) + Math.random() * Math.abs(position.zEnd - position.zStart));

        // Set random speed
        const speed = 0.05 + Math.random() * 0.15;

        // Create bounding box
        const carBox = new THREE.Box3().setFromObject(car);

        // Set initial direction and rotation
        const direction = Math.random() > 0.5 ? 1 : -1;
        if (direction === -1) {
            car.rotation.y = Math.PI; // Rotate car 180 degrees if moving in the opposite direction
        }

        cars.push({ car, position, speed, direction, box: carBox });

        scene.add(car);
    }

    // Add the aircraft model
    let aircraft = assets[7].scene.clone();
    aircraft.scale.set(0.5, 0.5, 0.5);

    // Set initial position for the aircraft
    const aircraftInitialX = -50 + Math.random() * 110; // Random initial x position within -50 to 60
    aircraft.position.set(aircraftInitialX, 50, 0);

    // Set random speed for the aircraft
    const aircraftSpeed = 0.025;

    // Create bounding box for the aircraft
    const aircraftBox = new THREE.Box3().setFromObject(aircraft);

    // Set initial direction and rotation for the aircraft
    let aircraftDirection = Math.random() > 0.5 ? 1 : -1;
    if (aircraftDirection === -1) {
        aircraft.rotation.y = Math.PI; // Rotate aircraft 180 degrees if moving in the opposite direction
    }

    scene.add(aircraft);

    // Truck positions and movement ranges
    const truckPositions = [
        { xStart: 60, xEnd: -57, y: 0, z: -6 },
        { xStart: -60, xEnd: 57, y: 0, z: -33 }
    ];

    // Add trucks
    const trucks = [];
    for (let i = 0; i < 2; i++) {
        const truckModelIndex = 8 + i; // assets[8] and assets[9]
        const truck = assets[truckModelIndex].scene;
        truck.rotation.y = Math.PI/2;
        truck.scale.set(0.1, 0.1, 0.1);

        // Set initial position
        const position = truckPositions[i];
        const initialX = position.xStart;
        truck.position.set(initialX, position.y, position.z);

        // Set random speed
        const speed = 0.03 + Math.random() * 0.07;

        // Create bounding box
        const truckBox = new THREE.Box3().setFromObject(truck);

        // Set initial direction and rotation
        const direction = Math.random() > 0.5 ? 1 : -1;
        if (direction === -1) {
            truck.rotation.y = Math.PI + Math.PI/2; // Rotate truck 180 degrees if moving in the opposite direction
        }

        trucks.push({ truck, position, speed, direction, box: truckBox });

        scene.add(truck);
    }

    //Retrive tutorial blocks
    const allBlocks = scene.children.filter(obj => obj.name.startsWith('Tblock'));
    allBlocks.forEach(block => {
        block.boundingBox = new THREE.Box3().setFromObject(block);
    });

    //TV Screens
    const tvScreen = scene.children.filter(obj => obj.name.startsWith('TV'));
    tvScreen.forEach(tv => {
        tv.boundingBox = new THREE.Box3().setFromObject(tv);
    });
    console.log(tvScreen);

    //skin add bounding box
    const skins = scene.children.filter(obj => obj.name.startsWith('character '));

    skins.forEach(skin => {
        skin.boundingBox = new THREE.Box3().setFromObject(skin);
    });


    //game portal
    const portal = scene.children.find(obj => obj.name === 'portal');
    portal.boundingBox = new THREE.Box3().setFromObject(portal);
    
    let rings = scene.children.filter(obj => obj.name.startsWith('ring '));
    let pops = scene.children.filter(obj => obj.name.startsWith('reward '));
    let screens = scene.children.filter(obj => obj.name.startsWith('screen '));

    //project description
    const grounds = scene.children.filter(obj => obj.name.startsWith('glass ground '));
    grounds.forEach(ground => {
        ground.boundingBox = new THREE.Box3().setFromObject(ground);
        ground.boundingBox.max.y += 10;
    });

    //tailor
    const tailor = scene.children.find(obj => obj.name.startsWith('tailor'));
    tailor.boundingBox = new THREE.Box3().setFromObject(tailor);
    tailor.boundingBox.expandByScalar(2);
    tailor.boundingBox.max.z += 8;
    tailor.boundingBox.max.x += 5;

    await hideLoadingScreen();
    checkMobile(); //is phone browser or desktop
    startStory();


    // Create toggle button
    const toggleButton = document.createElement('img');
    toggleButton.id = 'dark-mode-toggle';
    toggleButton.src = localStorage.getItem('darkMode') === 'true' ? '/assets/night-mode.svg' : '/assets/light-bulb.svg';
    toggleButton.style.position = 'absolute';
    toggleButton.style.top = '15px';
    toggleButton.style.right = '15px';
    toggleButton.style.width = '25px';
    toggleButton.style.height = '25px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.opacity = '0.7';

    toggleButton.addEventListener('mouseenter', () => {
        toggleButton.style.opacity = '1.5';
      });
      
      toggleButton.addEventListener('mouseleave', () => {
        toggleButton.style.opacity = '0.7';
      });

    document.body.appendChild(toggleButton);

    toggleButton.addEventListener('click', () => {
    isDarkMode = localStorage.getItem('darkMode') !== 'true';
    localStorage.setItem('darkMode', isDarkMode);
    toggleButton.src = isDarkMode ? '/assets/night-mode.svg' : '/assets/light-bulb.svg';
    updateSceneLighting(isDarkMode);

    if (isDarkMode) {
        playNightMusic();
    } else {
        playBackgroundMusic();
    }

    });

    // Apply saved dark mode preference on load
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
        updateSceneLighting(true);
    }
    else{
        updateSceneLighting(false);
    }   


    /////////////////////////////////////////////////////////

    let isFirstPerson = false;
    let zoomLevel = 2;
    let isDragging = false;
    let initialMousePosition = new THREE.Vector2();
    let initialCameraPosition = new THREE.Vector3();
    let gameCamera = false;

    camera.position.set(0, 5, zoomLevel);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('wheel', (event) => {
        const zoomSpeed = 1;
        zoomLevel += event.deltaY * zoomSpeed * 0.01;
        zoomLevel = Math.max(2, Math.min(zoomLevel, 20));
        if (!isFirstPerson) {
            camera.position.set(0, 5, zoomLevel);
        }
    });

    window.addEventListener('mousedown', (event) => {
        if (event.button === 0) {
            isDragging = true;
            initialMousePosition.set(event.clientX, event.clientY);
            initialCameraPosition.copy(camera.position);
            playClickSound();
        }
    });

    window.addEventListener('mousemove', (event) => {
        if (isDragging && !isFirstPerson) {
            const deltaX = event.clientX - initialMousePosition.x;
            const deltaY = event.clientY - initialMousePosition.y;
            const rotationSpeed = 0.005;

            const offset = new THREE.Vector3(0, 1, zoomLevel).applyQuaternion(character.quaternion);
            const newCameraPosition = new THREE.Vector3().copy(character.position).add(offset);

            camera.position.copy(newCameraPosition);
            camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * rotationSpeed);
            camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), deltaY * rotationSpeed);

            camera.lookAt(character.position);
        }
    });

    window.addEventListener('mouseup', (event) => {
        if (event.button === 0) {
            isDragging = false;
            camera.position.copy(initialCameraPosition);
            camera.lookAt(character.position);
        }
    });

    const keys = {
        KeyW: false,
        KeyS: false,
        KeyA: false,
        KeyD: false,
        KeyQ: false,
        KeyE: false,
        Space: false,
        KeyR: false,
        ArrowLeft: false,
        ArrowRight: false,
        KeyF: false,
        KeyP: false,
        Digit1: false,
        Digit2: false,
        Digit3: false

    };

    let currentDirection = 0; // 0: forward, 1: right, 2: backward, 3: left
    let targetRotationY = character.rotation.y;

    function onKeyDown(event) {
        if (keys.hasOwnProperty(event.code)) {
            keys[event.code] = true;
        }

        if (event.code === 'ArrowLeft') {
            playScreenSound();
            currentDirection = (currentDirection + 3) % 4; // Turn left
            targetRotationY += Math.PI / 2;
            console.log('Turned left');
        }
        if (event.code === 'ArrowRight') {
            playScreenSound();
            currentDirection = (currentDirection + 1) % 4; // Turn right
            targetRotationY -= Math.PI / 2;
            console.log('Turned right');
        }

        if(keys.KeyP && keys.Digit2){
            if(character){
                character.position.set(0,0.6,0.8);
                playResetSound();
                initialPosition.set(0,0.6,0.8);
            }
        }

        if(keys.KeyP && keys.Digit1){
            if(character){
                character.position.set(22,0.6,-6);
                playResetSound();
                initialPosition.set(22, 0.6, -11);
            }
        }

        if(keys.KeyP && keys.Digit3){
            if(character){
                character.position.set(-30, 1.6, -12);
                playResetSound();
                initialPosition.set(-30, 1.6, -12);
            }
        }

    }

    function onKeyUp(event) {
        if (keys.hasOwnProperty(event.code)) {
            keys[event.code] = false;
        }

        if (event.code === 'Space') {
            isFirstPerson = !isFirstPerson;
        }

        if (event.code === 'KeyR') {
            if (character) {
                character.position.copy(initialPosition);
                playResetSound();
            }
        }
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    playOceanSound();

    // Randomly play horn sound
    setInterval(() => {
        if (Math.random() < 0.03) { // 3% chance to play the horn sound every second
            playHornSound();
        }
    }, 1000);

    let hornPlaying = false;

    function smoothRotate() {
        if (character.rotation.y !== targetRotationY) {
            const delta = targetRotationY - character.rotation.y;
            character.rotation.y += delta * 0.1;
        }
    }

    let isRingCollision = false;
    let moveSpeed;
    let liftSpeed;
    let score =0 ;
    let previousPosition = new THREE.Vector3();
    let skinChanged = false;
    let isScreenOn = true;
    let wind = 0.6;
    let isTailor = false;
    let isSkin = false;
    let storyStarted = false;
    let currentGround;


    ////////////////////////////////////////////////////////////////

    async function animate() {
        requestAnimationFrame(animate);

        TWEEN.update();
        const characterBox = new THREE.Box3().setFromObject(character);
        
        if (character) {
            if(isMobile()){
                moveSpeed = 0.16;
                liftSpeed = 0.18;
                wind = 0.2 ;
            }
            else{
                moveSpeed = 0.2;
                liftSpeed = 0.4;
                wind = 0.5;
            }

            if(!isRingCollision){
                if(previousPosition.distanceTo(character.position) > 4){
                    previousPosition.copy(character.position) ;
                }
           
            }

            // 0: forward, 1: right, 2: backward, 3: left
            if (keys.KeyW) {
                playMoveSound();
                switch (currentDirection) {
                    case 0: character.position.z -= moveSpeed+0.1; break; // forward
                    case 1: character.position.x += moveSpeed+wind; break; // right
                    case 2: character.position.z += moveSpeed+0.1; break; // backward
                    case 3: character.position.x -= moveSpeed+wind; break; // left
                }
            }
            if (keys.KeyS) {
                playMoveSound();
                switch (currentDirection) {
                    case 0: character.position.z += moveSpeed; break; // backward
                    case 1: character.position.x -= moveSpeed + wind; break; // left
                    case 2: character.position.z -= moveSpeed; break; // forward
                    case 3: character.position.x += moveSpeed + wind; break; // right
                }
            }
            if (keys.KeyA) {
                playMoveSound();
                switch (currentDirection) {
                    case 0: character.position.x -= moveSpeed + wind; break; // left
                    case 1: character.position.z -= moveSpeed; break; // forward
                    case 2: character.position.x += moveSpeed + wind; break; // right
                    case 3: character.position.z += moveSpeed; break; // backward
                }
            }
            if (keys.KeyD) {
                playMoveSound();
                switch (currentDirection) {
                    case 0: character.position.x += moveSpeed + wind; break; // right
                    case 1: character.position.z += moveSpeed; break; // backward
                    case 2: character.position.x -= moveSpeed + wind; break; // left
                    case 3: character.position.z -= moveSpeed; break; // forward
                }
            }
            if (keys.KeyQ) {
                playAirBalloonSound();
                character.position.y += liftSpeed;
            }
            if (keys.KeyE) {
                if (character.position.y - liftSpeed > 0) {
                    playAirBalloonFallSound();
                    character.position.y -= liftSpeed;
                } else {
                    playEndSound();
                }
            }

            console.log('character psotion ' + character.position.x + ', ' + character.position.y + ', ' + character.position.z);
            //tutorial blocks
            
            allBlocks.forEach(block => {
                if (characterBox.intersectsBox(block.boundingBox)) {

                    // Calculate the direction vector from the character's center to the block's center
                    const characterCenter = new THREE.Vector3();
                    const blockCenter = new THREE.Vector3();
                    characterBox.getCenter(characterCenter);
                    block.boundingBox.getCenter(blockCenter);
                    const direction = new THREE.Vector3().subVectors(blockCenter, characterCenter).normalize();
            
                    // Move the block along the direction vector
                    const splashDistance = 3; // Adjust this value as needed
                    block.position.add(direction.multiplyScalar(splashDistance));
                    block.boundingBox.setFromObject(block); // Update the block's bounding box after moving the block

                    // Play sound effect
                    playGlassSound();
                    block.position.y = -1;
                }
            });

            //Tv Screens
            tvScreen.forEach(tv => {
                if (characterBox.intersectsBox(tv.boundingBox)) {

                    playScreenSound();
                    // Calculate the overlap
                    const overlap = characterBox.intersection(tv.boundingBox);
            
                    // Determine which side of the TV screen the character is touching
                    if (overlap.width > overlap.height) {  // Character is hitting the left or right side
                        if (characterBox.center.x < tv.boundingBox.center.x) {
                            // Character is on the left, move them to the left of the TV
                            characterBox.position.x = tv.boundingBox.max.x;
                        } else {
                            // Character is on the right, move them to the right of the TV
                            characterBox.position.x = tv.boundingBox.min.x - characterBox.width;
                        }
                    } else {  // Character is hitting the top or bottom side
                        if (characterBox.center.y < tv.boundingBox.center.y) {
                            // Character is above, move them above the TV
                            characterBox.position.y = tv.boundingBox.max.y;
                        } else {
                            // Character is below, move them below the TV
                            characterBox.position.y = tv.boundingBox.min.y - characterBox.height;
                        }
                    }
                }
            });

            grounds.forEach(ground => {//contains
                if (characterBox.intersectsBox(ground.boundingBox)) {
                    endStory();
                    console.log("intersecting");
                    //project description
                    if (!storyStarted && currentGround !== ground.name) {
                        storyStarted = true;
                        currentGround = ground.name;
                        projectStory(scene, ground.name);
                        console.log(ground.name);
                    }
                                      
                }
                else{
                    if(storyStarted && currentGround == ground.name){
                        console.log("not intersecting");
                        stopStory();
                        storyStarted = false;
                        currentGround = '';
                    }
                }
            });

            //power station
            powers.forEach(power => {
                if (characterBox.intersectsBox(power.boundingBox)) {

                    playSparkSound();
                    character.position.copy(previousPosition); 
                    if(isScreenOn){
                        powerTouch();   

                        powerOff();     
                        powers.forEach(power => {
                            power.powerLight.visible = true;
                        });

                        if(isDarkMode){
                            ambientLight.intensity -= 0.4;
                            light1.intensity -= 0.23;
                            light2.intensity -= 0.03;
                            light3.intensity -= 0.23;
                            light4.intensity -= 0.05;

                            isScreenOn = false;
                        }
                        else{
                            ambientLight.intensity -= 0.7;
                            light1.intensity -= 0.23;
                            light2.intensity -= 0.33;
                            light3.intensity -= 0.23;
                            light4.intensity -= 0.85;
                            
                            isScreenOn = false;
                        }
                        
                    }
                    else{
                            // Restore original intensity values

                        
                            ambientLight.intensity = originalIntensities.ambientLight;
                            light1.intensity = originalIntensities.light1;
                            light2.intensity = originalIntensities.light2;
                            light3.intensity = originalIntensities.light3;
                            light4.intensity = originalIntensities.light4;

                            powers.forEach(power => {
                                power.powerLight.visible = false;
                            });
                            isScreenOn = true;
                        }
                }
            });

            //skin 
            skins.forEach(skin => {

                if (characterBox.intersectsBox(skin.boundingBox)) {
                    playSkinSound();
                    const index = parseInt(skin.name.replace('character ', ''));
            
                    // Remove current character model
                    while (character.children.length > 0) {
                        character.remove(character.children[0]);
                    }
        
                    // Add new skin model
                    chara[index].scene.children.forEach(child => {
                        character.add(child.clone());
                    });

                    character.add(torchLight);
                    torchLight.target = character;
                    
                    localStorage.setItem('selectedSkin', index);
                    console.log(`Character skin changed to: ${index}`);
                    skinChanged = true;
                }
            });

            if(skinChanged){
                skinText(scene);
                skinChanged = false;
            }

            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            if(characterBox.intersectsBox(tailor.boundingBox)){
                if (!isTailor) { // Play only if not already playing
                    playTailorSound();
                    isTailor = true;
                }
            } else {
                if (isTailor) { // Stop the sound if it is playing and the character leaves
                    stopTailorSound();
                    isTailor = false;
                }
            }
            

            if(characterBox.intersectsBox(portal.boundingBox)){

                await playGame(scene);

                //game ring
                rings = scene.children.filter(obj => obj.name.startsWith('ring '));

                rings.forEach(ring => {
                    ring.outerBox = new THREE.Box3().setFromObject(ring);
                    ring.holeBox = new THREE.Box3().setFromCenterAndSize(
                        ring.position.clone(), // Use the ring's actual position
                        new THREE.Vector3(1, 1, 1) // Adjust hole size as needed
                    );
                });


                pops = scene.children.filter(obj => obj.name.startsWith('reward '));
                pops.forEach(pop => {
                    pop.boundingBox = new THREE.Box3().setFromObject(pop);
                });

                character.position.set(22, 8, 6.9); 

                //camera.up.set(0, 1, 0); 

                //show the track     
                gameCamera = true;   
                playScreenSound(); 
                camera.lookAt(new THREE.Vector3(1, 0, 0));   
                camera.position.set(24, 7.5, 7);
                camera.rotateY(Math.PI) ;
                await delay(1500); 
                
                playScreenSound();
                camera.position.set(9, 17, 21.5);
                //camera.rotateY(Math.PI) ;
                await delay(1500); 
                gameCamera = false; 

                character.position.set(22, 8, 6.9); 
                
                switch (currentDirection) {
                    case 0: // Forward (+z axis)
                        targetRotationY -= Math.PI / 2;
                        break;
                    case 1: // Right (+x axis)
                        targetRotationY = -Math.PI / 2;
                        break;
                    case 2: // Backward (-z axis)
                        targetRotationY += Math.PI / 2;
                        break;
                    case 3: // Left (-x axis)
                        targetRotationY = -Math.PI / 2;
                        break;
                }

                currentDirection = 1 ; // 1: right               
            }

            //rings
            rings.forEach(ring => {

                if (characterBox.intersectsBox(ring.outerBox) && !characterBox.intersectsBox(ring.holeBox)) {
                    character.position.copy(previousPosition);
                    isRingCollision = true;
                }
                else{
                    isRingCollision = false;
                }
            });

            //rewards
            // Rewards
            pops.forEach((pop, index) => {
            if (characterBox.intersectsBox(pop.boundingBox)) {  
                playGlassSound();

                score += 1;
                console.log('score ' + score);

                if(score == 14){
                    for (let j = rings.length - 1; j >= 0; j--) {
                        scene.remove(rings[j]);
                        rings.splice(j, 1);
                    }
                    for (let j = pops.length - 1; j >= 0; j--) {
                        scene.remove(pops[j]);
                        pops.splice(j, 1);
                    }
                }

                scene.remove(pop);
                pops.splice(index, 1);
            }
            });

            if(score == 14){
                drawFinish(scene);
                score = 0;
            }
            
            
                

            if (isFirstPerson && !gameCamera) {
                // Calculate the direction vector from the camera to the character
                const direction = new THREE.Vector3();
                direction.subVectors(character.position, camera.position).normalize();
            
                // Update the camera position
                camera.position.set(
                    character.position.x - direction.x * 0.06,
                    character.position.y,
                    character.position.z - direction.z * 0.06
                );
            
                // Calculate the look-at position
                const lookAtPosition = new THREE.Vector3(
                    character.position.x + direction.x,
                    character.position.y,
                    character.position.z + direction.z
                );
            
                // Set the camera to look at the calculated position
                camera.lookAt(lookAtPosition);
            } else if(!isFirstPerson && !gameCamera) {
                if (!isDragging) {
                    const offset = new THREE.Vector3(0, 1, zoomLevel).applyQuaternion(character.quaternion);
                    camera.position.copy(character.position).add(offset);
                    camera.lookAt(character.position);
                }
            }
        }

        // Update car positions
        for (const carData of cars) {
            const { car, position, speed, direction, box } = carData;

            car.position.z += speed * direction;

            // Reverse direction if car reaches the end of its range
            if (car.position.z > Math.max(position.zStart, position.zEnd) || car.position.z < Math.min(position.zStart, position.zEnd)) {
                carData.direction *= -1;
                car.rotation.y += Math.PI; // Rotate car 180 degrees when direction changes
            }

            // Update bounding box for the car
            box.setFromObject(car);

            // Check collision with character
            if (box.intersectsBox(characterBox)) {
                if (!hornPlaying) {
                    playHornSound();
                    hornPlaying = true;
                }
                car.position.z -= speed * direction; // Move car back to avoid collision
            } else {
                hornPlaying = false; // Reset horn playing status when no collision
            }
        }

        // Update aircraft position
        aircraft.position.x += aircraftSpeed * aircraftDirection;

        // Reverse direction if aircraft reaches the end of its range
        if (aircraft.position.x > 60 || aircraft.position.x < -50) {
            aircraftDirection *= -1;
            aircraft.rotation.y += Math.PI; // Rotate aircraft 180 degrees when direction changes
        }

        // Update bounding box for the aircraft
        aircraftBox.setFromObject(aircraft);

        // Update truck positions
        for (const truckData of trucks) {
            const { truck, position, speed, direction, box } = truckData;

            truck.position.x += speed * direction;

            // Reverse direction if truck reaches the end of its range
            if (truck.position.x > Math.max(position.xStart, position.xEnd) || truck.position.x < Math.min(position.xStart, position.xEnd)) {
                truckData.direction *= -1;
                truck.rotation.y += Math.PI; // Rotate truck 180 degrees when direction changes
            }

            // Update bounding box for the truck
            box.setFromObject(truck);
            if (box.intersectsBox(characterBox)) {
                truck.position.x -= speed * direction; // Move truck back to avoid collision
            }

            // Check collision with cars
            for (const carData of cars) {
                if (box.intersectsBox(carData.box)) {
                    truck.position.x -= (speed+1) * direction; // Move truck back to avoid collision
                    carData.car.position.z -= carData.speed * carData.direction; // Move car back to avoid collision
                }
            }
        }

        smoothRotate();
        renderer.render(scene, camera);
    }

    animate();
}