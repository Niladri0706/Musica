console.log('Lets write JavaScript');
let currentSong=new Audio();
let songs;
let currfolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder){
    currfolder=folder;
    let a=await fetch(`/${folder}/`)
    let response=await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }
   
    //show songs in playlist
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+`
        <li>
        <img class="invert" src="img/music.svg" alt="" />
        <div class="info">
          <div>${song.replaceAll("%20"," ")}</div>
          <div>MUSICA</div>
        </div>
        <div class="playnow">
          <span>Play</span>
          <img class="invert" src="img/play.svg" alt="" />
        </div> </li>`;
}

//attach event listener for each song
Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
        
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
    
})
return songs
}

const playMusic=(track,pause=false)=>{
    
    currentSong.src=`/${currfolder}/`+track
    if(!pause){
        currentSong.play()
        play.src="img/pause.svg"
    }
   
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"

    
}

async function displayAlbums() {
    let a=await fetch(`/songs/`)
    let response=await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let anchors=div.getElementsByTagName("a")
    let cardcontainer=document.querySelector(".cardcontainer")
    let array=Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
        if(e.href.includes("/songs/")){
            let folder = e.href.split("/").slice(-1)[0]
            //get data of each folder
            let a=await fetch(`/songs/${folder}/info.json`)
            let response=await a.json();
           
            cardcontainer.innerHTML=cardcontainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#f5f7fa" d="M256 80C149.9 80 62.4 159.4 49.6 262c9.4-3.8 19.6-6 30.4-6c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48c-44.2 0-80-35.8-80-80V384 336 288C0 146.6 114.6 32 256 32s256 114.6 256 256v48 48 16c0 44.2-35.8 80-80 80c-26.5 0-48-21.5-48-48V304c0-26.5 21.5-48 48-48c10.8 0 21 2.1 30.4 6C449.6 159.4 362.1 80 256 80z"/></svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="" />
            <h2>${response.title}</h2>
            <p>${response.description}</p>
          </div>`
        }
    }
// Load the playlist whenever card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e => { 
    e.addEventListener("click", async item => {
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
      

    })
})

   
} 

async function main(){
    //list of songs
     await getSongs("songs/chill") 
    playMusic(songs[0],true)
   
    //display all albums
    await displayAlbums()

//attach event listener to previous,play and next
play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src="img/pause.svg"
    }
    else{
        currentSong.pause()
        play.src="img/play.svg"
    }
})

//listen for timeupdate event
currentSong.addEventListener("timeupdate",()=>{
   
    document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 +"%";
})

//add event listener to seekbar
document.querySelector(".seekbar").addEventListener("click",e=>{
   let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent+"%";
   currentSong.currentTime =((currentSong.duration)*percent)/100;
})

//add event listener for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"
})
//add event listener for close button
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-130%"
})

//add event listener to previous and next song
previous.addEventListener("click",()=>{
   
    let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    
    if((index-1)>=0){
    playMusic(songs[index-1])
    }
})

next.addEventListener("click",()=>{
    let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    
    if((index+1)<songs.length){
    playMusic(songs[index+1])
    }
})

//add event listner to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log("setting volume to",e.target.value,"/100")
    currentSong.volume=parseInt(e.target.value)/100;
})
 //add event listener to mute 
 document.querySelector(".volume>img").addEventListener("click", e=>{ 
    if(e.target.src.includes("img/volume.svg")){
        e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
        currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }

})

}
main()
