const allSongs = [
    {
        id: 1,
        title: "Dive On In",
        artist: "Colby Ramsay",
        duration: "2:49",
        src: "./songs/01-dive-on-in.mp3",
        artwork: "./artwork/01-dive-on-in.png",
    },
    {
        id: 2,
        title: "Without 中",
        artist: "Colby Ramsay",
        duration: "3:21",
        src: "./songs/02-without-chu.mp3",
        artwork: "./artwork/02-without-chu.png",
    },
    {
        id: 3,
        title: "Apple Season",
        artist: "Colby Ramsay",
        duration: "1:45",
        src: "./songs/03-apple-season.mp3",
        artwork: "./artwork/03-apple-season.png",
    },
    {
        id: 4,
        title: "Don't Worry Baby",
        artist: "Colby Ramsay",
        duration: "3:38",
        src: "./songs/04-dont-worry-baby.mp3",
        artwork: "./artwork/04-dont-worry-baby.png",
    },
    {
        id: 5,
        title: "Untitled",
        artist: "Colby Ramsay",
        duration: "1:29",
        src: "./songs/05-untitled.mp3",
        artwork: "./artwork/05-untitled.png",
    },
    {
        id: 6,
        title: "Round the Bend",
        artist: "Colby Ramsay",
        duration: "2:36",
        src: "./songs/06-round-the-bend.mp3",
        artwork: "./artwork/06-round-the-bend.png",
    },
    {
        id: 7,
        title: "Just Gotta Be Free",
        artist: "Colby Ramsay",
        duration: "2:01",
        src: "./songs/07-just-gotta-be-free.mp3",
        artwork: "./artwork/07-just-gotta-be-free.png",
    },
    {
        id: 8,
        title: "Coppertone Fox",
        artist: "Colby Ramsay",
        duration: "3:18",
        src: "./songs/08-coppertone-fox.mp3",
        artwork: "./artwork/08-coppertone-fox.png",
    },
    {
        id: 9,
        title: "Catch a Vision",
        artist: "Colby Ramsay",
        duration: "3:09",
        src: "./songs/09-catch-a-vision.mp3",
        artwork: "./artwork/09-catch-a-vision.png",
    },
];

const playBtn = document.getElementById("play");
const artwork = document.getElementById("artwork");

const player = {
    songs: [...allSongs],
    currentSong: null,
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

const playSong = (id) => {
    const song = player.songs.find(track => track.id === id);
    if (!song) return;
    audio.src = song.src;
    audio.title = song.title;
    audio.currentTime = 0;
    player.currentSong = song;
    setPlayButton(true);
    artwork.src = song.artwork;
    audio.play().catch(console.error);
};

const nextSong = () => {
    if (player.currentSong === null) {
        playSong(player.songs[0].id);
        return;
    }

    const currentSongIndex = getCurrentSongIndex();
    const nextTrack = player.songs[currentSongIndex + 1];

    if (nextTrack) {
        playSong(nextTrack.id);
    } else {
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        player.currentSong = null;
        setPlayButton(false);
    }
};

const getCurrentSongIndex = () => player.songs.indexOf(player.currentSong);

playBtn.addEventListener("click", () => {

    // First click ever
    if (player.currentSong === null) {
        playSong(player.songs[0].id);
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

audio.addEventListener("ended", nextSong);

