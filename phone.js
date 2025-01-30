function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function isLargeScreenMobile() {
    return isMobile() && window.innerWidth > 600; // Adjust threshold if needed
}

function createControlButtons() {
    const isLargeScreen = isLargeScreenMobile();

    const controls = [
        { id: "forward", text: "↑", style: "bottom: 140px; left: 30%; transform: translateX(-50%);" },
        { id: "backward", text: "↓", style: "bottom: 40px; left: 30%; transform: translateX(-50%);" },
        
        // Only adjust left and right for large-screen phones
        {
            id: "left",
            text: "←",
            style: isLargeScreen
                ? "bottom: 70px; left: 20.5%; transform: translateY(-50%);"  // Adjusted for large-screen phones
                : "bottom: 70px; left: 8.55%; transform: translateY(-50%);"
        },
        {
            id: "right",
            text: "→",
            style: isLargeScreen
                ? "bottom: 70px; left: 33.6%; transform: translateY(-50%);" // Adjusted for large-screen phones
                : "bottom: 70px; left: 38.8%; transform: translateY(-50%);"
        },

        { id: "up", text: "Q", style: "bottom: 120px; right: 10%; transform: translateY(-50%);" },
        { id: "down", text: "E", style: "bottom: 40px; right: 10%; transform: translateY(-50%);" },
        { id: "turn-left", text: "←←", style: "top: 50%; left: 10%; transform: translateY(-50%);" },
        { id: "turn-right", text: "→→", style: "top: 50%; right: 10%; transform: translateY(-50%);" },
        { id: "reset", text: "R", style: "top: 8%; left: 10%; transform: translateY(-50%);" },
        { id: "view", text: "o", style: "bottom: 90px; left: 30%; transform: translateX(-50%);" }
    ];

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
}

function triggerKey(controlId, eventType) {
    const keyMap = {
        forward: "KeyW",
        backward: "KeyS",
        left: "KeyA",
        right: "KeyD",
        up: "KeyQ",
        down: "KeyE",
        "turn-left": "ArrowLeft",
        "turn-right": "ArrowRight",
        reset: "KeyR",
        view: "Space"
    };

    const key = keyMap[controlId];
    if (key) {
        const event = new KeyboardEvent(eventType, { code: key });
        window.dispatchEvent(event);
    }
}

export function checkMobile() {
    if (isMobile()) {
        createControlButtons();
    }
}
