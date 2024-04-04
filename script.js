
/*

early attempt at "jock script" dark mode --
it worked, but didn't maintain state.
at the time, we didn't even know
what a function was.

--cr 3:18AM 3.19.24

bc, canada

function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}

*/

const sun = document.getElementById("sun");
const son = document.getElementById("son");
const halo = document.getElementById("halo");
const artBlock = document.getElementById("art-block");
const artInfo = document.getElementById("art-info");

const grow = () => {
    if (sun.classList.contains("grow-big")) {
        sun.classList.remove("grow-big");
        son.classList.remove("grow-med");
        halo.classList.remove("grow-margin");
        artBlock.classList.remove("grow-y");
        artInfo.classList.remove("full-opacity");
        artBlock.classList.remove("padding-18");
        /*
        artBlock.classList.remove("disable-hover");
        */
    } else {
        sun.classList.add("grow-big");
        son.classList.add("grow-med");
        halo.classList.add("grow-margin");
        artBlock.classList.add("grow-y");
        artInfo.classList.add("full-opacity");
        artBlock.classList.add("padding-18");
        /*
        artBlock.classList.add("disable-hover");
        */
    }
}

/*
should use TOGGLE for above
*/

sun.addEventListener("click", grow);
son.addEventListener("click", grow);
artBlock.addEventListener("click", grow);

/*
const webDevBtn = document.getElementById("web-dev-btn");
const webDevContainer = document.getElementById("web-dev-container");

const showWebDev = () => {
    if (webDevContainer.classList.contains("hidden")) {
        webDevContainer.classList.remove("hidden");
    } else {
        webDevContainer.classList.add("hidden");
    }
}

webDevBtn.addEventListener("click", showWebDev);
*/

/*
below is code copied from our music player project
--cr 3:55PM 3.20.24
*/

const allSongs = [
    {
        id: 0,
        title: "simple drum beat",
        artist: "colby ramsay",
        duration: "0:13",
        src: "./songs/simple-drum-beat.mp3",
    },
    {
        id: 1,
        title: "disco beat build-up",
        artist: "colby ramsay",
        duration: "2:56",
        src: "./songs/disco-beat-build-up.mp3",
    },
    {
        id: 3,
        title: "flute disco beat",
        artist: "colby ramsay",
        duration: "2:36",
        src: "./songs/flute-disco-beat.mp3",
    },
];

const prevBtn = document.getElementById("previous");
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const nextBtn = document.getElementById("next");
const shufBtn = document.getElementById("shuffle");

const playlist = document.getElementById("playlist");

let currentSongs = {
    songs: [...allSongs],
    currentSong: null,
    currentSongTime: 0,
};

const highlightCurrentSong = () => {
    const playlistSongElements = document.querySelectorAll(".playlist-song");
    const songToHighlight = document.getElementById(`song-${currentSongs?.currentSong?.id}`);

    playlistSongElements.forEach((songEl) => {
        songEl.removeAttribute("aria-current");
    });

    if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

const displaySongs = (array) => {
    const songsHTML = array.map((song) => {
        return `<li id="song-${song.id}" class="playlist-song"><button class="playlist-button" onclick="playSong(${song.id})">${song.title}</button></li>`;
    }).join("");
    playlist.innerHTML = songsHTML;
};

const sortSongs = () => {
    currentSongs?.songs.sort((a, b) => {
        if (a.title < b.title) {
        return -1;
        }
        if (a.title > b.title) {
        return 1;
        }
        return 0;
    });
    return currentSongs?.songs;
}

displaySongs(sortSongs());

const audio = new Audio();

const playSong = (id) => {
    const song = currentSongs?.songs.find((song) => song.id === id);
    audio.src = song.src;
    audio.title = song.title;

    if (currentSongs?.currentSong === null || currentSongs?.currentSong.id !== song.id) {
        audio.currentTime = 0;
    } else {
        audio.currentTime = currentSongs?.currentSongTime;
    }
    currentSongs.currentSong = song;
    highlightCurrentSong();
    playBtn.classList.add("highlight");
    pauseBtn.classList.remove("highlight");
    audio.play();
    fetchNewImage();
};

const pauseSong = () => {
    currentSongs.currentSongTime = audio.currentTime;
    playBtn.classList.remove("highlight");
    pauseBtn.classList.add("highlight");
    audio.pause();
};

const nextSong = () => {
    if (currentSongs?.currentSong === null) {
        playSong(currentSongs?.songs[0].id);
    } else {
        const currentSongIndex = getCurrentSongIndex();
        const nextSong = currentSongs?.songs[currentSongIndex + 1];
        
        playSong(nextSong.id);
    }
};

const previousSong = () => {
    if (currentSongs?.currentSong === null) return;
    else {
        const currentSongIndex = getCurrentSongIndex();
        const previousSong = currentSongs?.songs[currentSongIndex - 1];
        
        playSong(previousSong.id);
    }
};

const shuffle = () => {
    currentSongs?.songs.sort(() => Math.random() - 0.5);
    currentSongs.currentSong = null;
    currentSongs.currentSongTime = 0;
    displaySongs(currentSongs?.songs);
    pauseSong();
}

const getCurrentSongIndex = () => currentSongs?.songs.indexOf(currentSongs?.currentSong);

playBtn.addEventListener("click", () => {
    if (currentSongs?.currentSong === null) {
        playSong(currentSongs?.songs[0].id);
    } else {
        playSong(currentSongs?.currentSong.id)
    }
});

pauseBtn.addEventListener("click", pauseSong);

nextBtn.addEventListener("click", nextSong);

prevBtn.addEventListener("click", previousSong);

shufBtn.addEventListener("click", shuffle);

audio.addEventListener("ended", () => {
    const currentSongIndex = getCurrentSongIndex();
    const nextSongExists = currentSongs?.songs[currentSongIndex + 1] !== undefined;
    if (nextSongExists) {
        nextSong();
    } else {
        currentSongs.currentSong = null;
        currentSongs.currentSongTime = 0;
        pauseSong();
        highlightCurrentSong();
    }
});

const gifContainer = document.getElementById("gif-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

async function fetchNewImage() {
    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=tJpxCdKAb4sssyhZR7oFtkctocM3F3qC&s=${searchInput.value}`, { mode: 'cors' });
        const imgData = await response.json();
        const fetchedImg = imgData.data.images.original.url;
        gifContainer.style.backgroundImage = `url("${fetchedImg}")`;
    } catch (err) {
        alert("Rats in the machine! Something went wrong; please try again & enter only regular numbers or letters.");
    }
}

fetchNewImage();

searchBtn.addEventListener("click", () => {
    setDefault();
    fetchNewImage();
});

function setDefault() {
    // Check if the input value is empty
    if (searchInput.value === '') {
        let defaultValue = 'clouds';
        alert(`Rats in the machine! You forgot to type something; how about "${defaultValue}"?`)
        // Assign a default value if the input is empty
        searchInput.value = defaultValue;
    }
}

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        setDefault();
        fetchNewImage();
        e.target.blur();
    }
});

/*
below is new code to clear the input form
--cr 12:42AM 3.21.24
*/

searchInput.addEventListener('focus', (e) => {
    // Clear the input value when the user clicks on it
    e.target.value = '';
});

/*
below is an attempt to make a regex test:

const regex = /^[a-zA-Z0-9]+$/;

function checkInput(input) {
    return regex.test(input);
}

if (checkInput(searchInput)) {
    alert("wonderful news!");
} else {
    alert("terrible news!");
}

*/