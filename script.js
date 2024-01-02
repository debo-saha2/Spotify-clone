// alert("I tried my best to do this website Dynamic. But after clicking the album the album songs are not loaded on the playlist but We Can listen the songs from clicking the albums. i am trying to fix the remaining.");

let currentsong = new Audio();
let current_folder;

// convert second to min:sec

function convertSecondsToMinutesAndSeconds(totalSeconds) {
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;

  seconds = seconds < 10 ? "0" + seconds : seconds;
  return minutes + ":" + parseInt(seconds);
}

// start of js to take all songs
async function allsongs(folder) {
  current_folder = folder;
  let a = await fetch(`/ipl/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let lists = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < lists.length; index++) {
    const element = lists[index];
    if (element.href.endsWith(".ogg")) {
      songs.push(element.href.split(`/ipl/`)[1]);
    }
  }
  return songs;
}

// lets play the selected music

const playthismusic = (track, pause = false) => {
  currentsong.src = `/songs/ipl/` + track;
  if (!pause) {
    currentsong.play();
    play.src = "svgs/pause.svg";
  }
  document.querySelector(".music_name").innerHTML = decodeURI(track);
};

async function displayalbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  let cards = document.querySelector(".cards");
  div.innerHTML = response;

  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if ((e.href.includes("/songs/")  && !e.href.includes(".htaccess")) ) {
      let folder = e.href.split("/").slice(-1)[0];
      let b = await fetch(`/songs/ipl/info.json`);
      let jesons = await b.json();
      cards.innerHTML =
        cards.innerHTML +
        `<div data-folder="ipl" class="card">
      <img
        src="/songs/ipl/image.jpg"
        alt=""
      />
      <h3>${jesons.title}</h3>
      <p>${jesons.description}</p>
    </div>`;
    }
  }

  // load the playlist when card is clicked

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      console.log(`songs/${item.currentTarget.dataset.folder}`);
      songs = await allsongs(`songs/${item.currentTarget.dataset.folder}`);
      playthismusic(songs[0]);
    });
  });
}

async function main() {
  let folder;
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/")) {
      folder = e.href.split("/").slice(-1)[0];
    }
  }

  // get this song list
  let songs = await allsongs(`/songs/`);

  // Display of albums

  displayalbums();

  // take the library playlist

  let songslibrary_playlist = document
    .querySelector(".library_playlists")
    .getElementsByTagName("ul")[0];

  songslibrary_playlist.innerHTML = " ";

  for (const song of songs) {
    songslibrary_playlist.innerHTML =
      songslibrary_playlist.innerHTML +
      `<li>         <div>
                  <img src="svgs/music.svg" alt="" />
                  <ul class="library_artist_song">
                    <li>${song.replace("%20", " ")}</li>
  
                  </ul>
                  <ul class="playnow">
                    <li>Play Now</li>
                    <li><img src="svgs/play.svg" alt="" /></li>
                  </ul>
                </div>                
   </li>`;
  }

  // event listener to playlist

  Array.from(
    document.querySelector(".library_playlists").getElementsByTagName("div")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      playthismusic(
        e
          .querySelector(".library_artist_song")
          .firstElementChild.innerHTML.trim()
      );
      play.src = "svgs/pause.svg";
    });
    return songs;
  });

  // enable of play button

  let play = document.getElementById("play");
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "svgs/pause.svg";
    } else {
      currentsong.pause();
      play.src = "svgs/play.svg";
    }
  });

  // update of time

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(
      ".song_duration"
    ).innerHTML = `${convertSecondsToMinutesAndSeconds(
      currentsong.currentTime
    )}/${convertSecondsToMinutesAndSeconds(currentsong.duration)}`;

    let current_percentage =
      (currentsong.currentTime / currentsong.duration) * 100;

    // add event to the circle

    document.querySelector(".circle").style.left = current_percentage + "%";
  });

  // add event to the music progress bar to increase or decrease manually

  document.querySelector(".line").addEventListener("click", (e) => {
    let random_progress =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = random_progress + "%";

    currentsong.currentTime = (currentsong.duration * random_progress) / 100;
  });

  // add menu
  document.querySelector(".menu").addEventListener("click", () => {
    document.querySelector(".left_box").style.left = "0";
  });
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left_box").style.left = "-2000px";
  });

  // add next and previous button

  document.getElementById("previous").addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index > 0) {
      playthismusic(songs[index - 1]);
    }
  });
  document.getElementById("next").addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playthismusic(songs[index + 1]);
    }
  });

  // add volume button range

  document.getElementById("volume_range").addEventListener("change", (e) => {
    currentsong.volume = e.target.value / 100;
    let song_volume_value = e.target.value / 100;
    if (song_volume_value == 0) {
      volume.src = "svgs/volumeoff.svg";
    } else {
      volume.src = "svgs/volumeon.svg";
    }
  });

  // add mute button
  let volume = document.getElementById("volume");
  volume.addEventListener("click", () => {
    if (currentsong.volume == 0) {
      currentsong.volume = 1;
      volume.src = "svgs/volumeon.svg";
    } else {
      currentsong.volume = 0;
      volume.src = "svgs/volumeoff.svg";
    }
  });
}

main();
