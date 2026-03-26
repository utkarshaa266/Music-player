
const songs = [
  {
    title: "SoundHelix Song 1",
    artist: "SoundHelix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17"
  },
  {
    title: "SoundHelix Song 2",
    artist: "SoundHelix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea"
  },
  {
    title: "SoundHelix Song 3",
    artist: "SoundHelix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819"
  },
  {
    title: "SoundHelix Song 6",
    artist: "SoundHelix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    cover: "https://images.unsplash.com/photo-1493225457124-7eb318f75b87"
  },
  {
    title: "SoundHelix Song 9",
    artist: "SoundHelix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1"
  },
  {
    title: "SoundHelix Song 10",
    artist: "SoundHelix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    title: "SoundHelix Song 11",
    artist: "SoundHelix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    cover: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2"
  },
  {
    title: "SoundHelix Song 12",
    artist: "SoundHelix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    cover: "https://images.unsplash.com/photo-1492724441997-5dc865305da7"
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
const searchBar = document.getElementById("search-bar");

// Initialize App
function init() {
    renderPlaylist();
    loadSong(songs[currentSongIndex]);
    
    // Set initial volume
    audio.volume = volumeBar.value;
}
function filterSongs(query) {
    const filtered = songs.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase())
    );

    renderFilteredPlaylist(filtered);
}

function renderFilteredPlaylist(filteredSongs) {
    playlistContainer.innerHTML = '';

    filteredSongs.forEach((song) => {
        const li = document.createElement('li');
        li.classList.add('playlist-item');

        li.innerHTML = `
            <img src="${song.cover}" alt="Cover">
            <div class="playlist-item-info">
                <span class="playlist-item-title">${song.title}</span>
                <span class="playlist-item-artist">${song.artist}</span>
            </div>
        `;

        li.addEventListener('click', () => {
            const index = songs.indexOf(song);
            currentSongIndex = index;
            loadSong(song);
            playSong();
        });

        playlistContainer.appendChild(li);
    });
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
searchBar.addEventListener("input", (e) => {
    const query = e.target.value;

    if (query === "") {
        renderPlaylist();
    } else {
        filterSongs(query);
    }
});
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Initialization
init();
