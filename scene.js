import * as THREE from 'three';
import { playClickSound, playAirBalloonSound, 
    playEndSound, playResetSound, playBackgroundMusic, 
    playOceanSound, playHornSound, playGlassSound, 
    playScreenSound, playNightMusic } from './sound';
import TWEEN from '@tweenjs/tween.js';
import { startTutorial } from './tutorial';
import { hideLoadingScreen } from './loading.js';
import { startProject } from './project';

export async function initScene(assets) {
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
    const initialPosition = new THREE.Vector3(-37, 0.6, -11); //0,0.6,0
    character.scale.set(0.03, 0.03, 0.03);
    character.position.copy(initialPosition);
    scene.add(character);

    // Add the background model
    let background = assets[2].scene;
    background.scale.set(0.006, 0.006, 0.006);
    background.position.set(0, -0.3, 0); // Adjust position above the ground
    scene.add(background);

    await startTutorial(scene, assets);
    await startProject(scene, assets);
    await hideLoadingScreen();

    // Add a skybox
    function toggleDarkMode() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        updateSceneLighting(isDarkMode);
        }
    
        function updateSceneLighting(isDarkMode) {
            if (isDarkMode) {
                ambientLight.intensity = 0.4;
                light1.intensity = 0.08;
                light2.intensity = 0.08;
                light3.intensity = 0.08;
                light4.intensity = 0.2;
                scene.background = assets[11]; // Night sky
            } else {
                ambientLight.intensity = 0.8;
                light1.intensity = 0.25;
                light2.intensity = 0.25;
                light3.intensity = 0.25;
                light4.intensity = 1;
                scene.background = assets[1]; // Day sky
            }
        }
    
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
        const isDarkMode = localStorage.getItem('darkMode') !== 'true';
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
        const initialZ = position.zStart + Math.random() * (position.zEnd - position.zStart);
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

    // Add portals (playground and projects)
    const portalGeometry = new THREE.TorusGeometry(1, 0.2, 16, 100);
    const portalMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const playgroundPortal = new THREE.Mesh(portalGeometry, portalMaterial);
    const projectsPortal = new THREE.Mesh(portalGeometry, portalMaterial);

    playgroundPortal.position.set(-5, 1, 0);
    projectsPortal.position.set(5, 1, 0);

    playgroundPortal.rotation.x = Math.PI / 2;
    projectsPortal.rotation.x = Math.PI / 2;

    scene.add(playgroundPortal, projectsPortal);

    // Create bounding boxes for portals
    const playgroundPortalOuterBox = new THREE.Box3().setFromObject(playgroundPortal);
    const projectsPortalOuterBox = new THREE.Box3().setFromObject(projectsPortal);

    // Define the bounding box for the hole (simplified as a smaller box)
    const playgroundPortalHoleBox = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(-5, 1, 0), new THREE.Vector3(0.5, 0.5, 0.5));
    const projectsPortalHoleBox = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(5, 1, 0), new THREE.Vector3(0.5, 0.5, 0.5));

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

    /////////////////////////////////////////////////////////

    let isFirstPerson = false;
    let zoomLevel = 2;
    let isDragging = false;
    let initialMousePosition = new THREE.Vector2();
    let initialCameraPosition = new THREE.Vector3();

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
        ArrowRight: false
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
            character.rotation.y += delta * 0.1; // Adjust the 0.1 to change the smoothness
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        TWEEN.update();
        const characterBox = new THREE.Box3().setFromObject(character);

        if (character) {
            const moveSpeed = 0.2;
            const liftSpeed = 0.4;

            const previousPosition = character.position.clone();

            if (keys.KeyW) {
                switch (currentDirection) {
                    case 0: character.position.z -= moveSpeed+0.03; break; // forward
                    case 1: character.position.x += moveSpeed; break; // right
                    case 2: character.position.z += moveSpeed; break; // backward
                    case 3: character.position.x -= moveSpeed; break; // left
                }
            }
            if (keys.KeyS) {
                switch (currentDirection) {
                    case 0: character.position.z += moveSpeed; break; // backward
                    case 1: character.position.x -= moveSpeed; break; // left
                    case 2: character.position.z -= moveSpeed+ 0.03; break; // forward
                    case 3: character.position.x += moveSpeed; break; // right
                }
            }
            if (keys.KeyA) {
                switch (currentDirection) {
                    case 0: character.position.x -= moveSpeed; break; // left
                    case 1: character.position.z -= moveSpeed + 0.03; break; // forward
                    case 2: character.position.x += moveSpeed; break; // right
                    case 3: character.position.z += moveSpeed; break; // backward
                }
            }
            if (keys.KeyD) {
                switch (currentDirection) {
                    case 0: character.position.x += moveSpeed; break; // right
                    case 1: character.position.z += moveSpeed; break; // backward
                    case 2: character.position.x -= moveSpeed; break; // left
                    case 3: character.position.z -= moveSpeed + 0.1; break; // forward
                }
            }
            if (keys.KeyQ) {
                playAirBalloonSound();
                character.position.y += liftSpeed;
            }
            if (keys.KeyE) {
                if (character.position.y - liftSpeed > 0) {
                    character.position.y -= liftSpeed;
                } else {
                    playEndSound();
                }
            }

            console.log('character psotion ' + character.position.x + ', ' + character.position.y + ', ' + character.position.z);

            // Check collision with outer part of portals and allow movement through the hole
            if (characterBox.intersectsBox(playgroundPortalOuterBox) && !characterBox.intersectsBox(playgroundPortalHoleBox)) {
                character.position.copy(previousPosition);
            }
            if (characterBox.intersectsBox(projectsPortalOuterBox) && !characterBox.intersectsBox(projectsPortalHoleBox)) {
                character.position.copy(previousPosition);
            }

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
            

            if (isFirstPerson) {
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
            } else {
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

        playgroundPortal.rotation.z += 0.01;
        projectsPortal.rotation.z -= 0.01;

        smoothRotate();
        renderer.render(scene, camera);
    }

    animate();
}