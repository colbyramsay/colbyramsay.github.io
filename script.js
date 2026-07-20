const album = {
    title: "Catch a Vision",
    src: "./songs/catch-a-vision.mp3",
    artworkTimeline: [
        { time: 0.000, artwork: "./artwork/01-dive-on-in.png" },
        { time: 169.408, artwork: "./artwork/02-without-chu.png" },
        { time: 369.912, artwork: "./artwork/03-apple-season.png" },
        { time: 474.783, artwork: "./artwork/04-dont-worry-baby.png" },
        { time: 692.560, artwork: "./artwork/05-untitled.png" },
        { time: 781.210, artwork: "./artwork/06-round-the-bend.png" },
        { time: 1008.499, artwork: "./artwork/07-just-gotta-be-free.png" },
        { time: 1129.203, artwork: "./artwork/08-coppertone-fox.png" },
        { time: 1326.909, artwork: "./artwork/09-catch-a-vision.png" },
    ],
};

const playBtn = document.getElementById("play");
const artwork = document.getElementById("artwork");
const loadingScreen = document.getElementById("loading-screen");
const loadingStatus = document.getElementById("loading-status");
const loadingProgress = document.getElementById("loading-progress");

const player = {
    started: false,
    initialized: false,
    currentArtwork: null,

    analytics: {
        albumStarted: false,
        halfwayReached: false,
        albumCompleted: false,
    },
};

const audio = new Audio();
audio.preload = "auto";

let loadingTimer = null;

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

function trackEvent(eventName) {
    if (typeof gtag === "function") {
        gtag("event", eventName);
    }
}

function setPlayButton(isPlaying) {
    playBtn.innerHTML = isPlaying ? pauseIcon : playIcon;
    playBtn.setAttribute(
        "aria-label",
        isPlaying ? "Pause album" : "Play album"
    );
}

setPlayButton(false);

function showLoadingScreen() {
    loadingScreen.hidden = false;
}

function hideLoadingScreen() {
    loadingScreen.hidden = true;
}

function setLoadingStatus(text) {
    loadingStatus.textContent = text;
}

function setLoadingProgress(filled) {
    const total = 18;
    loadingProgress.textContent =
        "█".repeat(filled) + "░".repeat(total - filled);
}

function resetLoadingScreen() {
    setLoadingStatus("Loading audio...");
    setLoadingProgress(0);
}

function startLoadingScreen() {
    resetLoadingScreen();

    clearTimeout(loadingTimer);
    
    loadingTimer = setTimeout(() => {
        showLoadingScreen();
    }, 200);
}

function stopLoadingScreen() {
    clearTimeout(loadingTimer);
    loadingTimer = null;

    hideLoadingScreen();
}

const updateArtwork = () => {
    if (!player.started) return;

    if (
        !player.analytics.halfwayReached &&
        audio.currentTime >= audio.duration / 2
    ) {
        trackEvent("album_halfway");
        player.analytics.halfwayReached = true;
    }

    let currentArtwork = album.artworkTimeline[0].artwork;

    for (const entry of album.artworkTimeline) {
        if (audio.currentTime >= entry.time) {
            currentArtwork = entry.artwork;
        } else {
            break;
        }
    }

    if (player.currentArtwork !== currentArtwork) {
        artwork.src = currentArtwork;
        player.currentArtwork = currentArtwork;
    }
};

const playAlbum = () => {

    startLoadingScreen();

    audio.pause();

    audio.src = album.src;
    audio.title = album.title;
    audio.currentTime = 0;

    player.currentArtwork = null;

    artwork.src = album.artworkTimeline[0].artwork;
    player.currentArtwork = album.artworkTimeline[0].artwork;

    audio.play().catch(() => {});
};

const resetPlayer = () => {
    stopLoadingScreen();

    audio.pause();
    audio.currentTime = 0;
    audio.src = "";
    audio.title = "";

    player.started = false;
    player.initialized = false;
    player.currentArtwork = null;

    player.analytics.albumStarted = false;
    player.analytics.halfwayReached = false;
    player.analytics.albumCompleted = false;

    setPlayButton(false);
};

playBtn.addEventListener("click", () => {

    // 1st click
    if (!player.initialized) {
        playAlbum();
        return;
    }

    // Already playing → pause
    if (!audio.paused) {
        audio.pause();
        return;
    }

    // Paused → resume
    audio.play().catch(() => {});

});

document.addEventListener("keydown", (event) => {
    if (event.code !== "Space") return;

    event.preventDefault();
    playBtn.click();
    playBtn.blur();
});

audio.addEventListener("timeupdate", updateArtwork);
audio.addEventListener("ended", () => {

    if (!player.analytics.albumCompleted) {
        trackEvent("album_complete");
        player.analytics.albumCompleted = true;
    }

    resetPlayer();
});

audio.addEventListener("play", () => {
    setPlayButton(true);
});

audio.addEventListener("pause", () => {
    setPlayButton(false);
});

audio.addEventListener("canplay", () => {
    setLoadingStatus("Ready.");
    setLoadingProgress(18);
});

audio.addEventListener("playing", () => {

    player.initialized = true;
    player.started = true;

    if (!player.analytics.albumStarted) {
        trackEvent("album_start");
        player.analytics.albumStarted = true;
    }

    stopLoadingScreen();
});

audio.addEventListener("loadstart", () => {
    setLoadingProgress(6);
});

audio.addEventListener("loadedmetadata", () => {
    setLoadingStatus("Preparing playback...");
    setLoadingProgress(12);
});