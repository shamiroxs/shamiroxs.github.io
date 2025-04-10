export function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function isLargeScreenMobile() {
    return isMobile() && window.innerWidth > 600; // Adjust threshold if needed
}

let isGameFinished = localStorage.getItem("isGameFinished") === "true";

export function gameFinished() {
    isGameFinished = true;
    localStorage.setItem("isGameFinished", "true"); // Save state in localStorage
}

function removeControlButtons() {
    document.querySelectorAll(".control-button").forEach(button => button.remove());
}


function createControlButtons() {
    removeControlButtons(); 
    const isLargeScreen = isLargeScreenMobile();

    let controls = [
        { id: "forward", text: "↑", style: "bottom: 140px; left: 30%; transform: translateX(-50%);" },
        { id: "backward", text: "↓", style: "bottom: 40px; left: 30%; transform: translateX(-50%);" },
        
        // Only adjust left and right for large-screen phones
        {
            id: "left",
            text: "←",
            style: isLargeScreen
                ? "bottom: 70px; left: 20.3%; transform: translateY(-50%);"
                : "bottom: 70px; left: 8.55%; transform: translateY(-50%);"
        },
        {
            id: "right",
            text: "→",
            style: isLargeScreen
                ? "bottom: 70px; left: 33.6%; transform: translateY(-50%);"
                : "bottom: 70px; left: 38.8%; transform: translateY(-50%);"
        },

        { id: "up", text: "U", style: "bottom: 130px; right: 10%; transform: translateY(-50%);" },
        { id: "down", text: "D", style: "bottom: 30px; right: 10%; transform: translateY(-50%);" },
              
        { id: "reset", text: "R", style: "top: 8%; left: 10%; transform: translateY(-50%);" },
        { id: "view", text: "o", style: "bottom: 90px; left: 30%; transform: translateX(-50%);" },

    ];

    if(isGameFinished){

        controls = controls.concat([
            { id: "p1", text: "P1", style: "bottom: 230px; right: 10%; transform: translateY(-50%);" },
            { id: "p2", text: "P2", style: "bottom: 280px; right: 10%; transform: translateY(-50%);" },
            { id: "p3", text: "P3", style: "bottom: 330px; right: 10%; transform: translateY(-50%);" },
        ]);   
    }

    controls.forEach(({ id, text, style }) => {
        const button = document.createElement("div");
        button.id = id;
        button.className = "control-button";
        button.textContent = text;
        button.style.cssText = style;

        document.body.appendChild(button);

        button.addEventListener("touchstart", (e) => {
            e.preventDefault();
            triggerKey(id, "keydown");
        });

        button.addEventListener("touchend", (e) => {
            e.preventDefault();
            triggerKey(id, "keyup");
        });
    });

    addSwipeListeners(); // Add swipe event detection
}

function triggerMouseMove(deltaY) {
    const event = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        clientX: window.innerWidth / 2, // Simulate movement in the middle of the screen
        clientY: window.innerHeight / 2 + deltaY // Move up or down based on swipe direction
    });

    document.dispatchEvent(event);
}


function triggerMouseEvent(eventType, clientY) {
    const event = new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        clientX: window.innerWidth / 2, // Center the event
        clientY: clientY // Move based on swipe position
    });

    document.dispatchEvent(event);
}

// Add swipe gesture detection
function addSwipeListeners() {
    let startX = 0, startY = 0;
    let endX = 0, endY = 0;
    let isDragging = false;

    document.addEventListener("touchstart", (event) => {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
        endX = startX;
        endY = startY;
        isDragging = false;
    });

    document.addEventListener("touchmove", (event) => {
        endX = event.touches[0].clientX;
        endY = event.touches[0].clientY;
        const diffY = startY - endY;
        const moveAmount = Math.abs(diffY);

        if (moveAmount > 30) {
            if (!isDragging) {
                triggerMouseEvent("mousedown", startY);
                isDragging = true;
            }

            triggerMouseEvent("mousemove", endY);
        }
    });

    document.addEventListener("touchend", () => {
        let diffX = startX - endX;
        let diffY = startY - endY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > 10) {
                console.log("Swiped Left (Triggering 'ArrowLeft')");
                triggerKey("swipeLeft", "keydown");
                setTimeout(() => triggerKey("swipeLeft", "keyup"), 100);
            } else if (diffX < -10) {
                console.log("Swiped Right (Triggering 'ArrowRight')");
                triggerKey("swipeRight", "keydown");
                setTimeout(() => triggerKey("swipeRight", "keyup"), 100);
            }
        } else {
            // Vertical swipe
            if (diffY > 10) {  // Swiping up moves the mouse up
                console.log("Swiped Up (Triggering Mouse Move Up)");
                triggerMouseMove(-20); // Move mouse up
            } else if (diffY < -10) { // Swiping down moves the mouse down
                console.log("Swiped Down (Triggering Mouse Move Down)");
                triggerMouseMove(20); // Move mouse down
            }
        }
        if (isDragging) {
            triggerMouseEvent("mouseup", 0);
            isDragging = false;
        }

        startX = 0;
        startY = 0;
        endX = 0;
        endY = 0;

    });
}

const pressedKeys = {};

function triggerKey(controlId, eventType) {
    const keyMap = {
        forward: "KeyW",
        backward: "KeyS",
        left: "KeyA",
        right: "KeyD",
        up: "KeyQ",
        down: "KeyE",
        reset: "KeyR",
        view: "Space",
        swipeLeft: "ArrowLeft",
        swipeRight: "ArrowRight",
        p1: ["KeyP", "Digit1"],
        p2: ["KeyP", "Digit2"],
        p3: ["KeyP", "Digit3"]
    };

    const keys = Array.isArray(keyMap[controlId]) ? keyMap[controlId] : [keyMap[controlId]]; // Ensure array

    keys.forEach((key) => {
        if (eventType === "keydown") {
            pressedKeys[key] = true;
        } else {
            delete pressedKeys[key];
        }

        const event = new KeyboardEvent(eventType, { code: key });
        window.dispatchEvent(event);
    });
}

export function checkMobile() {
    if (isMobile()) {
        createControlButtons();
    }
}
