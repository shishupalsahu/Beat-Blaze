
console.log('lets write javascript');

async function getSongs(){

let a = await fetch("http://127.0.0.1:5500/spotify%20clone/songs/");
let response = await a.text();
console.log(response)
let div = document.createElement('div');
div.innerHTML = response;
 let as = div.getElementsByTagName("a")
 let songs = [];
 for(let index = 0; index < as.length; index++)
 {
    const element = as[index]
    if(element.href.endsWith(".mp3"))
    {
        songs.push(element.href.split('/songs/')[1]);
    }
 }
 return songs;

console.log(songs)
}

async function main(){
  // get list of all the songs 
let songs = await getSongs();
console.log(songs)


// used to put all songs in songList class's ul tag under 
// used to select songList class ul tag
let songUL = document.querySelector(".songList ").getElementsByTagName('ul')[0];

for (const song of songs) 
{
  songUL.innerHTML += `<li> <img  class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replace(/%20/g, " ")}</div>
                                <div>kajal</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img  class="invert" src="play.svg" alt="">
                            </div>                          
                        </li>`;
}

// play the first song in audio form 


}

main();