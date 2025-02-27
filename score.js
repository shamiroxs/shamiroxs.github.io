let score = 0;
const totalScore = 14;
let scoreCard;

export function createScoreCard() {
    if (!scoreCard) {
        scoreCard = document.createElement("div");
        scoreCard.id = "scoreCard";
        scoreCard.style.position = "fixed";
        scoreCard.style.top = "10px";
        scoreCard.style.left = "10px";
        scoreCard.style.padding = "10px";
        scoreCard.style.color = "#FFFF00";
        scoreCard.style.fontSize = "20px";
        scoreCard.style.fontWeight = "bold";
        scoreCard.style.fontFamily = "'Press Start 2P', cursive"; // Retro game font
        scoreCard.style.letterSpacing = "2px"; // Spaced-out letters for a digital feel
        scoreCard.style.textTransform = "uppercase";
        scoreCard.innerText = `${score}/${totalScore}`;
        document.body.appendChild(scoreCard);
    }
}

export function incrementScore() {
    if (scoreCard && score < totalScore) {
        score++;
        scoreCard.innerText = `${score}/${totalScore}`;
    }
}

export function removeScoreCard() {
    if (scoreCard) {
        document.body.removeChild(scoreCard);
        scoreCard = null;
        score = 0; // Reset score when removing scorecard
    }
}
