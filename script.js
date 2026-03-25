
const songs = [
    {
        title: "Neon Dreams",
        artist: "Synthwave Artist",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop"
    },
    {
        title: "Acoustic Breeze",
        artist: "Indie Band",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=400&auto=format&fit=crop"
    },
    {
        title: "Electro Flow",
        artist: "DJ Producer",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop"
    },
    {
        title: "Chill Lofi",
        artist: "Lofi Creator",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        cover: "https://images.unsplash.com/photo-1493225457124-7eb318f75b87?q=80&w=400&auto=format&fit=crop"
    },
    {
        title: "Midnight Drive",
        artist: "Retro Wave",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=400&auto=format&fit=crop"
    }
];

let currentSongIndex = 0;
const audio = new Audio();
let isPlaying = false;

// DOM Elements
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const coverArt = document.getElementById('cover-art');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const recordContainer = document.querySelector('.record-container');
const playlistContainer = document.getElementById('playlist');

// Initialize App
function init() {
    renderPlaylist();
    loadSong(songs[currentSongIndex]);
    
    // Set initial volume
    audio.volume = volumeBar.value;
}

// Load Song
function loadSong(song) {
    audio.src = song.url;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    coverArt.src = song.cover;
    
    // Update playlist active state
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Reset progress details to prevent artifacting from previous song
    progressBar.value = 0;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";
}

// Render Playlist
function renderPlaylist() {
    playlistContainer.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.classList.add('playlist-item');
        if (index === currentSongIndex) li.classList.add('active');
        
        li.innerHTML = `
            <img src="${song.cover}" alt="Cover">
            <div class="playlist-item-info">
                <span class="playlist-item-title">${song.title}</span>
                <span class="playlist-item-artist">${song.artist}</span>
            </div>
        `;
        
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(songs[currentSongIndex]);
            playSong();
        });
        
        playlistContainer.appendChild(li);
    });
}

// Play & Pause
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function playSong() {
    isPlaying = true;
    // Adjust padding so pause icon is centered properly
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    playBtn.style.paddingLeft = "0"; 
    recordContainer.classList.add('playing');
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    playBtn.style.paddingLeft = "5px";
    recordContainer.classList.remove('playing');
    audio.pause();
}

// Previous & Next
function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(songs[currentSongIndex]);
    if (isPlaying) playSong();
}

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) {
        currentSongIndex = 0;
    }
    loadSong(songs[currentSongIndex]);
    if (isPlaying) playSong();
}

// Update Progress Bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (isNaN(duration)) return;
    
    // Update progress bar value (0 to 100)
    const progressPercent = (currentTime / duration) * 100;
    progressBar.value = progressPercent;
    
    // Calculate display time
    let currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
}

// Set Duration on Load
audio.addEventListener('loadedmetadata', () => {
    let durationMinutes = Math.floor(audio.duration / 60);
    let durationSeconds = Math.floor(audio.duration % 60);
    if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
    durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
});

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);

// Progress Bar interaction
progressBar.addEventListener('input', (e) => {
   if (!isNaN(audio.duration)) {
       audio.currentTime = (e.target.value / 100) * audio.duration;
   }
});

volumeBar.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Initialization
init();
