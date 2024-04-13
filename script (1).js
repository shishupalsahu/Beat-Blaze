console.log('lets write javascript');
let currentSong = new Audio(); // Create a new Audio object to handle music playback
let songs;
let currfolder;

// Function to convert seconds to minutes:seconds format
function secondsToTime(seconds) {
  // Ensure seconds is a valid number
  if (typeof seconds !== 'number' || isNaN(seconds)) {
    return '00:00'; // Return '00:00' if seconds is not a valid number
  }

  // Calculate minutes and remaining seconds
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);

  // Format minutes and remaining seconds with leading zeros if needed
  let formattedMinutes = (minutes < 10) ? '0' + minutes : minutes;
  let formattedSeconds = (remainingSeconds < 10) ? '0' + remainingSeconds : remainingSeconds;

  // Return the formatted time string in the format '00:00'
  return `${formattedMinutes}:${formattedSeconds}`;
}

// Async function to fetch songs from a URL
async function getSongs(folder) {
  currfolder=folder;
  // let a = await fetch(`http://127.0.0.1:5500/${folder}/`);  
  let a = await fetch(`http://127.0.0.1:5500/spotify%20clone/${currfolder}/`); // Fetch data from the URL
  let response = await a.text(); // Get the response text
  console.log(response); // Log the response (optional)
  
  // Create a temporary div element to parse the response HTML
  let div = document.createElement('div');
  div.innerHTML = response;
  
  // Get all anchor elements from the response
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]); // Extract song names from URLs
    }
  }



  // Get the ul element to display the song list
  let songUL = document.querySelector(".songList").getElementsByTagName('ul')[0];
  songUL.innerHTML = ""
  // Populate the song list in the UI
  for (const song of songs) {
    songUL.innerHTML += `<li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replace(/%20/g, " ")}</div>
                                <div>kajal</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>                          
                        </li>`;
  }

  // Add click event listeners to each song list item
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
  
}

// Function to play a selected song
const playMusic = (track,pause=false) => {
  // currentSong.src = "/spotify%20clone/songs/" + track; // Set the source of the audio
  currentSong.src = `http://127.0.0.1:5500/spotify%20clone/${currfolder}/` + track;
  if(!pause)
  {
    currentSong.play();
    play.src = "img/pause.svg";
  }

  console.log(currentSong)
  // currentSong.play(); // Play the audio
  play.src = "img/pause.svg"; // Change play/pause button image
  document.querySelector(".songinfo").innerHTML = decodeURI(track); // Display the current song name
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"; // Display initial time

   
 
}

async function displayAlbums(){
  let a = await fetch(`http://127.0.0.1:5500/spotify%20clone/songs/`); // Fetch data from the URL
  let response = await a.text(); // Get the response text
  let div = document.createElement('div')
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  console.log(anchors)
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(anchors);

    for( let index = 2; index < Array.length; index++)
    {
        const e = array[index];
    
    console.log(e.href); 
    if(e.href.includes("/songs")){
    let folder=e.href.split("/").slice(-2)[0]; // Log the response (optional)
     console.log(folder);
    // get the mata data of the folder
    let a = await fetch(`http://127.0.0.1:5500/spotify%20clone/${folder}/info.json`); // Fetch data from the URL
    let response = await metadata.json(); // 
    console.log(response)
    cardContainer.innerHTML+= `
    <div data-folder="${folder}" class="card ">
    <div class="play ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
            <path
                d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                fill="#000000" />
        </svg>
    </div>
    <img src="http://127.0.0.1:5500/spotify%20clone/${currfolder}/cover.jpg" alt="">
    <h2>${response.title}</h2>
    <p>${response.description}</p>
</div>`
      


    }
}

Array.from(document.getElementsByClassName("card")).forEach(e=>{
  e.addEventListener('click',async (event)=>{
    let folder = event.currentTarget.dataset.folder;
    songs = await getSongs(`songs/${folder}`);
    // card par click krnse se first song play 
    playMusic(songs[0])
    
  });
 });
 
}

// Async function to handle the main logic
async function main() {
   await getSongs('songs/cs'); // Get the list of songs
  playMusic(songs[0],true)
  
  // Log the fetched songs (optional)
  // console.log(songs);

 // display all the album on the page

 displayAlbums()

  // Add click event listener to play/pause button
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = 'img/pause.svg'; // Change play/pause button image to pause
    } else {
      currentSong.pause();
      play.src = "img/play.svg"; // Change play/pause button image to play
    }
  });

  // Listen for time update event to display current time
  currentSong.addEventListener('timeupdate', () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToTime(currentSong.currentTime)}/${secondsToTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) * 100 + "%";
  });

  // aad an event listener to seekbar
  document.querySelector(".seekbar").addEventListener('click',e=>{
    let percent =  (e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent + "%";
    currentSong.currentTime=((currentSong.duration)*percent)/100;
  })

  //add event listener for add or remove hamburger

  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0";
  })
   

  // add event listener for close button

  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%"
  })

  // add event listener to previous and next
  
  previous.addEventListener("click",()=>{
    currentSong.pause()
    let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index-1)>=0)
    {
       playMusic(songs[index-1])
    }
  })

  next.addEventListener("click",()=>{

    currentSong.pause()
    let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1)<(songs.length))
    {
       playMusic(songs[index+1])
    }
  })

  // add event listener for set volume

  document.querySelector('.range ').getElementsByTagName("input")[0].addEventListener('change',(e)=>{
      currentSong.volume = parseInt(e.target.value)/100
  })

  // load the playlist whenever card is clicked
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
      currentSong.volume = 0;
      document.querySelector('.range input').value = 0;
    } else {
      e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
      currentSong.volume = 0.1;
      document.querySelector('.range input').value = 10;
    }
  });
  
 
   
}

main(); // Call the main function to start the application
