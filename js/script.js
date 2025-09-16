console.log('Welcome to my Own Spotify!');

let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://10.22.32.124:3000/assets/songs/")
    let response = await a.text()
    // console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("%5Cassets%5Csongs%5C")[1].split("320")[0])
        }
    }
    return songs
}

//Play the song
const playMusic = (track) => {
    currentSong.src = "assets/songs/" + track
    currentSong.play()
    play.src = "assets/img/pausesong.svg"

    document.querySelector(".playposter").innerHTML = `<img src="assets/img/${track.replaceAll("%20", " ").split("-")[0].trim()}.jpg" alt="" width="65px">`

    document.querySelector(".songname2").innerHTML = track.replaceAll("%20", " ").split("-")[0].trim()
    document.querySelector(".songmovie").innerHTML = track.replaceAll("%20", " ").split("-")[1].split("320")[0].trim()

    document.querySelector(".playbar").style.visibility = 'visible';
    document.querySelector(".playposter").style.visibility = 'visible';
    document.querySelector(".songname2").style.visibility = 'visible';
    document.querySelector(".songmovie").style.visibility = 'visible';
}

async function main() {
    //Get songs list
    let songs = await getSongs()

    //Showing all songs
    let songsUL = document.querySelector(".saved").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + `<li>
                            <div class="musicsvg">
                                <img src="/assets/img/music.svg" alt="">
                                <div class="songinfo">
                                    <div class="songname">${song.split("-")[0].replaceAll("%20", " ")}</div>
                                    <div class="songartist">${song.split("-")[1].replaceAll("%20", " ")}</div>
                                </div>
                            </div>

                            <div class="playbuttonsvg">
                                <img src="assets/img/playbutton.svg" alt="">
                            </div>
                        </li>`;
    }

    //Event for listening click on posters to play songs
    let playlogos = document.querySelectorAll(".playlogo")

    playlogos.forEach(playlogo => {
        playlogo.addEventListener("click", () => {
            // Navigate to the parent card
            let cards = playlogo.closest(".cards");

            let songTitle = cards.querySelector(".title a").innerHTML.trim();
            console.log(songTitle);

            console.log((songTitle.split("(From")[0] + "- " + songTitle.split("(From ")[1].split('"')[1] + " 320 Kbps.mp3").replaceAll(" ", "%20"))
            playMusic((songTitle.split("(From")[0] + "- " + songTitle.split("(From ")[1].split('"')[1] + " 320 Kbps.mp3").replaceAll(" ", "%20"))
        });
    });


    //Event listening click for songs to play 
    Array.from(document.querySelector(".saved").getElementsByTagName("li")).forEach(e => {
        e.querySelector(".playbuttonsvg").addEventListener("click", element => {
            console.log(e.querySelector(".songinfo").firstElementChild.innerHTML + "- " + e.querySelector(".songinfo").lastElementChild.innerHTML.trim());

            playMusic((e.querySelector(".songinfo").firstElementChild.innerHTML + "- " + e.querySelector(".songinfo").lastElementChild.innerHTML.trim()).replaceAll(" ", "%20") + " 320 Kbps.mp3".replaceAll(" ", "%20"));
        })
    });

    //Event listener for play
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "assets/img/pausesong.svg"
        }
        else {
            currentSong.pause()
            play.src = "assets/img/playsong.svg"
        }
    })

    //Timeupdate event listener
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        let percent = (currentSong.currentTime / currentSong.duration) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        document.querySelector(".progress").style.width = percent + "%";
    })

    //Seekbar event listener
    document.querySelector(".timecontrol").addEventListener("click", e => {
        // let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percent = (offsetX / rect.width) * 100;

        document.querySelector(".circle").style.left = percent + "%";
        document.querySelector(".progress").style.width = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })
}

main()