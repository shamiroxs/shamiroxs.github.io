import { resumeText, thankyouText } from "./game";
import { isMobile } from "./phone.js";

export function gotoLink(scene, link){
    let str = 'link ';
    if(link.name == str + (-43.8)){//abcd
        window.open("https://github.com/shamiroxs/abcd", "_blank");
    }
    else if(link.name == str + (-58.599999999999994)){//dbms
        window.open("https://github.com/MrCodeCrafter/BDW", "_blank");
    }
    else if(link.name == str + (-73.5)){//internship
        window.open("https://github.com/shamiroxs/PRODIGY_SD_01", "_blank");
    }
    else if(link.name == str + (-80.3)){//intership register
        window.open("https://prodigyinfotech.dev/apply", "_blank");
    }
    else if(link.name == str + (-67)){//lector
        window.open("https://github.com/shamiroxs/lector", "_blank");
    }
    else if(link.name == str + (-59.8)){//lector channel
        window.open("https://www.youtube.com/@lector-audiobook", "_blank");
    }
    else if(link.name == str + (-53.099999999999994)){//powerbi
        window.open("https://github.com/shamiroxs/Learning-with-Data", "_blank");
    }
    else if(link.name == str + (-38.199999999999996)){//hello 2
        //window.open("https://www.google.com", "_blank");
    }
    else if(link.name == str + (-23.4)){//hello 1
        ///window.open("https://www.google.com", "_blank");
    }
    else if(link.name == str + (-33.6)){//internship
        window.open("assets/Resume.pdf", "_blank");
        resumeText();
    }
    
}

function showQRCode() {
    // Check if QR container already exists, prevent duplicates
    if (document.getElementById("qr-container")) return;

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
    //closeButton.style.background = "red";
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

    // Create text
    let text = document.createElement("p");
    text.innerText = "☕ Buy Me a Coffee!";
    text.style.marginBottom = "10px";

    // Create QR Code Image
    let qrImage = document.createElement("img");
    qrImage.src = "/assets/qr_code.png";
    qrImage.alt = "UPI QR Code";
    qrImage.style.width = "200px";
    qrImage.style.height = "200px";

    // Append elements
    qrContainer.appendChild(closeButton);
    qrContainer.appendChild(text);
    qrContainer.appendChild(qrImage);
    document.body.appendChild(qrContainer);
}

let qrTimeout;

export function openLink(logo){
    let str = 'logo ';
    if(logo.name == str + (1)){//github
        window.open("https://github.com/shamiroxs/", "_blank");
    }
    else if(logo.name == str + (2)){//linkedin
        window.open("https://www.linkedin.com/in/shamiroxs/", "_blank");
    }
    else if(logo.name == str + (3)){//whatsapp
        window.open("https://wa.me/+919544123218", "_blank");
    }
    else if(logo.name == str + (4)){//gmail
        window.open("mailto:shamirkolakkadan26@gmail.com", "_blank");
    }
    else if(logo.name == str + (5)){//coffee
        if(isMobile()){
            let iframe = document.createElement("iframe");
            iframe.style.width = "0px";
            iframe.style.height = "0px";
            iframe.style.border = "none";
            iframe.src = "upi://pay?pa=9544123218@ybl&pn=Shamir%20Ashraf&tn=Buy%20Me%20Coffee&am=15&cu=INR";
            document.body.appendChild(iframe);
            //window.open("upi://pay?pa=9544123218@ybl&pn=Shamir%20Ashraf&tn=Buy%20Me%20Coffee&am=15&cu=INR");
            
            showQRCode();
        }
        else{
            showQRCode();
        }
    }
}