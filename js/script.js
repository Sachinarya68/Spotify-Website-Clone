console.log('Welcome to my Own Spotify!');

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

const playMusic = (track) => {
    let audio = new Audio(track);
    audio.play();
}

async function main() {
    //Get songs list
    let songs = await getSongs()
    // console.log(songs);

    //Show songs
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

    let currentSong;

    Array.from(document.querySelector(".saved").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log("/assets/songs/" + (e.querySelector(".songinfo").firstElementChild.innerHTML + "- " + e.querySelector(".songinfo").lastElementChild.innerHTML.trim()).replaceAll(" ", "%20") + " 320 Kbps.mp3".replaceAll(" ", "%20"));

            playMusic("/assets/songs/" + (e.querySelector(".songinfo").firstElementChild.innerHTML + "- " + e.querySelector(".songinfo").lastElementChild.innerHTML.trim()).replaceAll(" ", "%20") + " 320 Kbps.mp3".replaceAll(" ", "%20"));
        })
    });
}

main()