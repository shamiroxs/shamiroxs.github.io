import { isMobile } from "./phone";

// Create a container for the message
const messageDiv = document.createElement("div");
messageDiv.style.position = "absolute";
messageDiv.style.left = "50%";
messageDiv.style.transform = "translate(-50%, -50%)";
messageDiv.style.color = "white";
messageDiv.style.fontFamily = "Arial, sans-serif";
messageDiv.style.padding = "10px";
messageDiv.style.background = "rgba(0, 0, 0, 0.9)";
messageDiv.style.borderRadius = "10px";
messageDiv.style.textAlign = "center";
messageDiv.style.opacity = "0"; // Initially hidden
messageDiv.style.transition = "opacity 1s";

if (isMobile()) {
    messageDiv.style.top = "60%";
    messageDiv.style.fontSize = "18px";
} else {
    messageDiv.style.top = "80%";
    messageDiv.style.fontSize = "24px";
}
document.body.appendChild(messageDiv);

// Array to store timeout IDs
let timeouts = [];

// Function to show a message with fade-in and fade-out
function showMessage(text, delay, callback) {
    const timeout1 = setTimeout(() => {
        messageDiv.innerHTML = text;
        messageDiv.style.opacity = "1"; // Fade in

        const timeout2 = setTimeout(() => {
            messageDiv.style.opacity = "0"; // Fade out
            if (callback) {
                const timeout3 = setTimeout(callback, 1000); // Wait for fade-out before calling next step
                timeouts.push(timeout3);
            }
        }, 4000);

        timeouts.push(timeout2);
    }, delay);

    timeouts.push(timeout1);
}

// Show project-related messages
export function projectStory(scene, name) {
    const grounds = scene.children.filter(obj => obj.name.startsWith('glass ground '));
    let str = 'glass ground ';
    grounds.forEach(ground => {
        if (name === str + (-49.28)) {
            showMessage("It was a group project for our college fest, Takshak.", 20, () => {
                showMessage("Our motto was 'Anybody Can Dance,' so we named it ABCD!", 500, () => {
                    showMessage("Many people feel shy to dance in front of others,", 500, () => {
                        showMessage("So through gamification, we encouraged individuals to enjoy dancing with confidence.", 400, () => {});
                    });
                });
            });
        }
        else if(name == str + (-64.28)){
            showMessage("Inspired by a childhood game called Kozhithala.", 20, () => {
		    showMessage("We used to race to collect letters on scraps of paper.", 500, () => {
		        showMessage("In college, I wanted to bring that fun online — no installs, just play.", 500, () => {
		            showMessage("So I built CODE: a real-time multiplayer card game in the browser.", 500, () => {
		                showMessage("Fast, nostalgic, and playable anywhere. Just click and start.", 500, () => {});
		            });
		        });
		    });
		});

        }
        else if(name == str + (-78.28)){
            showMessage("During my internship at InfoTech Prodigy,", 20, () => {
                showMessage("I developed five projects that mainly focused on software development and data processing.", 500, () => {
                        showMessage("Through this experience, I gained skills in modular programming, debugging,", 500, () => {
                            showMessage("And deploying solutions in real-world scenarios.", 200, () => {});
                        });
                });
            });
        }
        else if(name == str + (-65.98)){
            showMessage("This is one of my personal projects.", 20, () => {
                showMessage("My main goal was to create successful YouTube Channel", 300, () => {
                    showMessage("For this, I needed a high volume of content in the least amount of time.", 300, () => {
                        showMessage("So, I developed Lector, which converts eBooks directly into Audiobook videos.", 400, () => {
                            showMessage("Check out my channel if you're interested!", 600, () => {});
                        });
                    
                    });
                });
            });
        }
        else if(name == str + (-52.13)){
            showMessage("This is one of my long-term personal projects.", 20, () => {
		  showMessage("I wanted to build a real-time multiplayer fantasy game.", 300, () => {
		    showMessage("So I created Emberlands: The Last Flame, a 3D RPG where players explore the world and duel with other players.", 400, () => {
		      showMessage("I used Three.js for 3D, Cannon.js for physics, and WebSockets to sync up to 10 players in real time.", 400, () => {
		        showMessage("The entire world is interactive and it's hosted live if you want to try it!", 600, () => {});
		      });
		    });
		  });
		});

        }
        else if(name == str + (-37.230000000000004)){
            showMessage("A mini project associated with APJ Abdul Kalam University.", 20, () => {
        		showMessage("I led a team of 3, to work on Deepfake Detection Bot.", 200, () => {
        			showMessage("Even though deepfake detection already exists, they are not easily available.", 300, () => {
            			showMessage("Users are not well aware about deepfakes and are spreading them throughout social media.", 400, () => {
                			showMessage("So we implemented this bot to detect deepfake in real-time, and prevent misinformation.", 500, () => {});
            			});
        			});
    			});
			 });
        }
        else if(name == str + (-22.23)){
            showMessage("Hello!", 20, () => {
            
            });
        }
    });
}

export function powerTouch(){
    showMessage("Power OFF!!", 20, () => {});
}

export function powerOff(){
    showMessage("Touch the Power Station again <br>to restore power.", 6000, () => {});
}

// Stop all messages immediately
export function stopStory() {
    // Clear all pending timeouts
    timeouts.forEach(clearTimeout);
    timeouts = [];

    // Hide the message instantly
    messageDiv.style.opacity = "0";
}

export function boostText(){
    showMessage("Shadow Blaze!", 20, () => {
        showMessage("4X speed activated.", 20, () => {});
    });
}
