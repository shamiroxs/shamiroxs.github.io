import { isMobile } from "./phone";


export function startStory(scene) {
    // Create a container for the message
    const messageDiv = document.createElement("div");
    messageDiv.style.position = "absolute";
    
    messageDiv.style.left = "50%";
    messageDiv.style.transform = "translate(-50%, -50%)";
    messageDiv.style.color = "white";

    messageDiv.style.fontFamily = "Arial, sans-serif";
    messageDiv.style.padding = "10px";
    messageDiv.style.background = "rgba(0, 0, 0, 0.7)";
    messageDiv.style.borderRadius = "10px";
    messageDiv.style.textAlign = "center";
    messageDiv.style.opacity = "0"; // Initially hidden
    messageDiv.style.transition = "opacity 1s";

    if(isMobile()){
        messageDiv.style.top = "60%";
        messageDiv.style.fontSize = "18px";
    }
    else{
        messageDiv.style.top = "80%";
        messageDiv.style.fontSize = "24px";
    }
    document.body.appendChild(messageDiv);

    function showMessage(text, delay, callback) {
        setTimeout(() => {
            messageDiv.innerHTML = text;
            messageDiv.style.opacity = "1"; // Fade in
            setTimeout(() => {
                messageDiv.style.opacity = "0"; // Fade out
                if (callback) setTimeout(callback, 1000); // Wait for fade-out before next step
            }, 3500);
        }, delay);
    }

    // Show messages without blocking other animations
    showMessage("Hello, I am Shamir's Balloon!", 20, () => {
        showMessage("This open world has hidden games and showcased projects.", 500, () => {
            showMessage("Happy Exploring!", 500, () =>{
                document.body.removeChild(messageDiv);
            });
        });
    });
}