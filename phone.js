export function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function isLargeScreenMobile() {
    return isMobile() && window.innerWidth > 600;
}

function createControlButtons() {
    const isLargeScreen = isLargeScreenMobile();

    const controls = [
        { id: "forward", text: "↑", style: "bottom: 140px; left: 30%; transform: translateX(-50%);" },
        { id: "backward", text: "↓", style: "bottom: 40px; left: 30%; transform: translateX(-50%);" },
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

    addSwipeListeners();
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

// Swipe detection
function addSwipeListeners() {
    let startY = 0;
    let isDragging = false;

    document.addEventListener("touchstart", (event) => {
        startY = event.touches[0].clientY;
        isDragging = false;
    });

    document.addEventListener("touchmove", (event) => {
        const currentY = event.touches[0].clientY;
        const diffY = startY - currentY;
        const moveAmount = Math.abs(diffY);

        if (moveAmount > 10) {
            if (!isDragging) {
                triggerMouseEvent("mousedown", startY);
                isDragging = true;
            }

            triggerMouseEvent("mousemove", currentY);
        }
    });

    document.addEventListener("touchend", () => {
        if (isDragging) {
            triggerMouseEvent("mouseup", 0);
            isDragging = false;
        }
    });
}

function triggerKey(controlId, eventType) {
    const keyMap = {
        left: "ArrowLeft",
        right: "ArrowRight"
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
