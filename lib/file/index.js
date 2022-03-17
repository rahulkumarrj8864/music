const from = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiURL = "https://api.lyrics.ovh";


//adding event listener in userinput
form.addEventListener('submit', e=>{
    e.preventDefault();
    searchValue = search.value.trim();
  
    if (!searchValue) {
      alert("There is nothing to search");
    } else {
      searchSong(searchValue);
     
    }
});

  //search song
  async function searchSong(searchValue) {
    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
    const data = await searchResult.json();

    showData(data);
}

//updating DOM
function showData(data) {
    result.innerHTML = `
    <ul class="songs">
      ${data.data.map(song => `<li>
                                                    <div>
                                                      <strong>
                                                      ${song.artist.name}
                                                      </strong> - ${song.title}
                                                    </div>
                                                    <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">
                                                      Get Lyrics
                                                    </button>
                                                    </li>
    `) .join("")
    }
    </ul>
  `
  if (data.prev || data.next) {
    more.innerHTML = `
      ${
        data.prev
          ? `<button class="next-prev" onclick="getMoreSongs('${data.prev}')">Prev</button>`
          : ""
      }
      ${
        data.next
          ? `<button class="next-prev" onclick="getMoreSongs('${data.next}')">Next</button>`
          : ""
      }
    `;
  } else {
    more.innerHTML = "";
  }
}

//for more song
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

//event listener in get layrics button
result.addEventListener("click", e=>{
  const clickedElement = e.target;

    //checking clicked element is button or not
    if (clickedElement.tagName === "BUTTON") {
      const artist = clickedElement.getAttribute("data-artist");
      const songTitle = clickedElement.getAttribute("data-songtitle");

      getLyrics(artist, songTitle);
    }
});


//get lyrics 
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  if (data.error) {
    result.innerHTML = data.error;
  } else {
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

    result.innerHTML = ` <h2><strong>
                                                ${artist}
                                                </strong> - ${songTitle}
                                      </h2>
                                      <span>${lyrics}</span>
                                  `;
  }
}