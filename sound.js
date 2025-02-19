import { Howl } from 'howler';

// Create global sound instances for each sound effect
const clickSound = new Howl({
    src: ['./assets/sounds/click.mp3'],
    volume: 0.5,
    rate: 1.5
});

const screenSound = new Howl({
    src: ['./assets/sounds/whoosh.mp3'],
    volume: 0.3,
    rate: 3
});

const endSoundEffect = new Howl({
    src: ['./assets/sounds/end.mp3'],
    volume: 1.04,
    rate: 2
});

const airBalloonSoundEffect = new Howl({
    src: ['./assets/sounds/air.mp3'],
    volume: 0.2
});

const airBalloonFallSound = new Howl({
    src: ['./assets/sounds/air.mp3'],
    volume: 0.1,
    rate: 0.9
});

const movementSound = new Howl({
    src: ['./assets/sounds/move.mp3'],
    volume: 1
});


const resetSound = new Howl({
    src: ['./assets/sounds/end.mp3'],
    volume: 0.5
});

const backgroundMusic = new Howl({
    src: ['./assets/sounds/background.mp3'],
    volume: 0.2,
    loop: true  // Set loop to true for infinite playback
});

const nightMusic = new Howl({
    src: ['./assets/sounds/night.mp3'],
    volume: 0.4,
    loop: true  // Set loop to true for infinite playback
});

const oceanSound = new Howl({
    src: ['./assets/sounds/ocean.mp3'],
    volume: 0.1,
    loop: true
});

const hornSound = new Howl({
    src: ['./assets/sounds/horn.mp3'],
    volume: 0.02
});

const glassSound = new Howl({
    src: ['./assets/sounds/glass.mp3'],
    volume: 0.9
});

const skinSound = new Howl({
    src: ['./assets/sounds/skin.mp3'],
    volume: 1.2,
    rate: 4
});

const sparkSound = new Howl({
    src: ['./assets/sounds/spark.mp3'],
    volume: 0.4
});

// Export functions to play the sounds
export function playClickSound() {
    clickSound.stop();
    clickSound.play();
}

export function playScreenSound() {
    screenSound.stop();
    screenSound.play();
}

export function playEndSound() {
    endSoundEffect.stop();
    endSoundEffect.play();    
}

export function playAirBalloonSound() {
    airBalloonSoundEffect.stop();
    airBalloonSoundEffect.play();
}

export function playAirBalloonFallSound() {
    airBalloonFallSound.stop();
    airBalloonFallSound.play();
}

export function playMoveSound() {
    
    //movementSound.stop();
    //movementSound.play();
}

export function playResetSound() {
    resetSound.stop();
    resetSound.play();
}

export function playBackgroundMusic() {
    nightMusic.stop();
    backgroundMusic.stop();
    backgroundMusic.play();
}

export function playNightMusic() {
    backgroundMusic.stop();
    nightMusic.stop();
    nightMusic.play();
}

export function playOceanSound() {
    oceanSound.stop();
    oceanSound.play();
}

export function playHornSound() {
    hornSound.stop();
    hornSound.play();
}

export function playGlassSound() {
    glassSound.stop();
    glassSound.play();
}

export function playSkinSound() {
    skinSound.stop();
    skinSound.play();
    
}

export function playSparkSound() {
    sparkSound.stop();
    sparkSound.play();
    
}