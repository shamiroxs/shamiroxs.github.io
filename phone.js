function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function createControlButtons() {
    const controls = [
        { id: "forward", text: "↑", style: "bottom: 130px; left: 30%; transform: translateX(-50%);" },
        { id: "backward", text: "↓", style: "bottom: 30px; left: 30%; transform: translateX(-50%);" },
        { id: "left", text: "←", style: "bottom: 60px; left: 5.55%; transform: translateY(-50%);" },
        { id: "right", text: "→", style: "bottom: 60px; left: 32.8%; transform: translateY(-50%);" },

        { id: "up", text: "Q", style: "bottom: 120px; right: 10%; transform: translateY(-50%);" },
        { id: "down", text: "E", style: "bottom: 40px; right: 10%; transform: translateY(-50%);" },
        { id: "turn-left", text: "←←", style: "top: 50%; left: 10%; transform: translateY(-50%);" },
        { id: "turn-right", text: "→→", style: "top: 50%; right: 10%; transform: translateY(-50%);" },
        { id: "reset", text: "R", style: "top: 8%; left: 10%; transform: translateY(-50%);" },
        { id: "view", text: "o", style: "bottom: 80px; left: 30%; transform: translateX(-50%);" },
    ];

    controls.forEach(({ id, text, style }) => {
        const button = document.createElement("div");
        button.id = id;
        button.className = "control-button";
        button.textContent = text;
        button.style.cssText = style;

        document.body.appendChild(button);

        // Add touch event listeners
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
export function checkMobile(){
    // Add controls only for mobile devices
    if (isMobile()) {
        createControlButtons();
    }
}
