import { resumeText, thankyouText } from "./game";
import { isMobile } from "./phone.js";

export function gotoLink(scene, link) {
    let str = "link ";
    if (link.name == str + (-43.8)) {
        window.open("https://github.com/shamiroxs/abcd", "_blank");
    } else if (link.name == str + (-58.6)) {
        window.open("https://github.com/MrCodeCrafter/BDW", "_blank");
    } else if (link.name == str + (-73.5)) {
        window.open("https://github.com/shamiroxs/PRODIGY_SD_01", "_blank");
    } else if (link.name == str + (-80.3)) {
        window.open("https://prodigyinfotech.dev/apply", "_blank");
    } else if (link.name == str + (-67)) {
        window.open("https://github.com/shamiroxs/lector", "_blank");
    } else if (link.name == str + (-59.8)) {
        window.open("https://www.youtube.com/@lector-audiobook", "_blank");
    } else if (link.name == str + (-53.1)) {
        window.open("https://github.com/shamiroxs/Learning-with-Data", "_blank");
    } else if (link.name == str + (-38.2)) {
        //window.open("https://www.google.com", "_blank");
    } else if (link.name == str + (-23.4)) {
        ///window.open("https://www.google.com", "_blank");
    } else if (link.name == str + (-33.6)) {
        window.open("assets/Resume.pdf", "_blank");
        resumeText();
    }
}

// Function to Show QR Code (Using qrcode.js Instead of Google API)
function showQRCode(n) {
    // Remove existing QR code if present
    let existingQR = document.getElementById("qr-container");
    if (existingQR) {
        console.log("QR Container already exists. Removing it first.");
        existingQR.remove();
    }

    // Create QR container
    let qrContainer = document.createElement("div");
    qrContainer.id = "qr-container";
    qrContainer.style.position = "fixed";
    qrContainer.style.top = "50%";
    qrContainer.style.left = "50%";
    qrContainer.style.transform = "translate(-50%, -50%)";
    qrContainer.style.background = "white";
    qrContainer.style.padding = "20px";
    qrContainer.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.2)";
    qrContainer.style.borderRadius = "10px";
    qrContainer.style.textAlign = "center";
    qrContainer.style.zIndex = "1000";

    // Create Close Button
    let closeButton = document.createElement("button");
    closeButton.innerHTML = "x";
    closeButton.style.position = "absolute";
    closeButton.style.top = "5px";
    closeButton.style.right = "10px";
    closeButton.style.color = "black";
    closeButton.style.border = "none";
    closeButton.style.fontSize = "16px";
    closeButton.style.padding = "5px 10px";
    closeButton.style.cursor = "pointer";
    closeButton.style.borderRadius = "50%";

    closeButton.onclick = function () {
        document.body.removeChild(qrContainer);
        thankyouText();
    };

    let text;
    let qrDiv = document.createElement("div"); // QR Code Container
    qrDiv.id = "qrcode";

    if (n == 1) {
        // Buy Me a Coffee QR Code
        text = document.createElement("p");
        text.innerText = "☕ Buy Me a Coffee!";
        text.style.marginBottom = "10px";

        new QRCode(qrDiv, {
            text: "upi://pay?pa=9544123218@ybl&pn=Shamir%20Ashraf&tn=Buy%20Me%20Coffee&am=15&cu=INR",
            width: 200,
            height: 200
        });
    } else if (n == 2) {
        // Portfolio QR Code
        text = document.createElement("p");
        text.innerText = "Sharing is appreciated!";
        text.style.marginBottom = "10px";

        new QRCode(qrDiv, {
            text: "https://shamir-ashraf.vercel.app",
            width: 200,
            height: 200
        });
    }

    // Append elements
    qrContainer.appendChild(closeButton);
    qrContainer.appendChild(text);
    qrContainer.appendChild(qrDiv);
    document.body.appendChild(qrContainer);
}

export function openLink(logo) {
    let str = "logo ";
    if (logo.name == str + 1) {
        window.open("https://github.com/shamiroxs/", "_blank");
    } else if (logo.name == str + 2) {
        window.open("https://www.linkedin.com/in/shamiroxs/", "_blank");
    } else if (logo.name == str + 3) {
        window.open("https://wa.me/+919544123218", "_blank");
    } else if (logo.name == str + 4) {
        window.open("mailto:shamirkolakkadan26@gmail.com", "_blank");
    } else if (logo.name == str + 5) {
        // Coffee Payment QR Code
        if (isMobile()) {
            let iframe = document.createElement("iframe");
            iframe.style.width = "0px";
            iframe.style.height = "0px";
            iframe.style.border = "none";
            iframe.src = "upi://pay?pa=9544123218@ybl&pn=Shamir%20Ashraf&tn=Buy%20Me%20Coffee&am=15&cu=INR";
            document.body.appendChild(iframe);
            showQRCode(1);
        } else {
            showQRCode(1);
        }
    } else if (logo.name == str + 6) {
        // Portfolio Share QR Code
        console.log("showQRCode(2) called");
        if (isMobile()) {
            if (navigator.share) {
                navigator
                    .share({
                        title: "Check out this portfolio!",
                        text: "Visit Shamir's Balloon:",
                        url: "https://shamir-ashraf.vercel.app",
                    })
                    .then(() => {
                        console.log("Shared successfully!");
                    })
                    .catch((error) => {
                        console.error("Error sharing:", error);
                    });
            } else {
                alert("Sharing not supported on this device.");
            }
            showQRCode(2);
        } else {
            showQRCode(2);
        }
    }
}
