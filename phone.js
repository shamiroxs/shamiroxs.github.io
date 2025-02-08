export function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function isLargeScreenMobile() {
    return isMobile() && window.innerWidth > 600; // Adjust threshold if needed
}

let isGameFinished = false;

export function gameFinished() {
    isGameFinished = true;
}

function removeControlButtons() {
    document.querySelectorAll(".control-button").forEach(button => button.remove());
}

function createControlButtons() {
    removeControlButtons(); // Ensure buttons are removed before creating new ones

    const isLargeScreen = isLargeScreenMobile();

    let controls = [
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

        { id: "up", text: "U", style: "bottom: 130px; right: 10%; transform: translateY(-50%);" },
        { id: "down", text: "D", style: "bottom: 30px; right: 10%; transform: translateY(-50%);" },

        { id: "reset", text: "R", style: "top: 8%; left: 10%; transform: translateY(-50%);" },
        { id: "view", text: "o", style: "bottom: 90px; left: 30%; transform: translateX(-50%);" },
    ];

    if (isGameFinished) {
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

export function checkMobile() {
    if (isMobile()) {
        createControlButtons();
    }
}
