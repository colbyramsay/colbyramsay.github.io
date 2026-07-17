const movements = [
    {
        id: 1,
        title: "Side A",
        src: "./songs/01-side-a.mp3",
    },
    {
        id: 2,
        title: "Side B",
        src: "./songs/02-side-b.mp3",
    },
    {
        id: 3,
        title: "Catch a Vision",
        src: "./songs/03-catch-a-vision.mp3",
    },
];

const playBtn = document.getElementById("play");
const artwork = document.getElementById("artwork");

const player = {
    movements: [...movements],
    currentMovement: null,
};

const audio = new Audio();
audio.preload = "auto";

const playIcon = `
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5.8c0-.8.8-1.3 1.5-.9l9 6.2c.6.4.6 1.3 0 1.7l-9 6.2c-.7.4-1.5-.1-1.5-.9V5.8z"/>
</svg>
`;

const pauseIcon = `
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="7" y="5" width="3.5" height="14"></rect>
    <rect x="13.5" y="5" width="3.5" height="14"></rect>
</svg>
`;

function setPlayButton(isPlaying) {
    playBtn.innerHTML = isPlaying ? pauseIcon : playIcon;
    playBtn.setAttribute(
        "aria-label",
        isPlaying ? "Pause album" : "Play album"
    );
}

setPlayButton(false);

const playMovement = (id) => {
    const movement = player.movements.find(item => item.id === id);
    if (!movement) return;

    audio.src = movement.src;
    audio.title = movement.title;
    audio.currentTime = 0;

    player.currentMovement = movement;

    setPlayButton(true);
    audio.play().catch(console.error);
};

const nextMovement = () => {
    if (player.currentMovement === null) {
        playMovement(player.movements[0].id);
        return;
    }

    const currentMovementIndex = getCurrentMovementIndex();
    const movement = player.movements[currentMovementIndex + 1];

    if (movement) {
        playMovement(movement.id);
    } else {
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        audio.title = "";
        player.currentMovement = null;
        setPlayButton(false);
    }
};

const getCurrentMovementIndex = () => player.movements.indexOf(player.currentMovement);

playBtn.addEventListener("click", () => {

    // First click ever
    if (player.currentMovement === null) {
        playMovement(player.movements[0].id);
        return;
    }

    // Already playing → pause
    if (!audio.paused) {
        audio.pause();
        setPlayButton(false);
        return;
    }

    // Paused → resume
    audio.play();
    setPlayButton(true);

});

document.addEventListener("keydown", (event) => {
    if (event.code !== "Space") return;

    event.preventDefault();
    playBtn.click();
    playBtn.blur();
});

audio.addEventListener("ended", nextMovement);

